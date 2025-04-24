from google.cloud import pubsub_v1
import google.cloud.logging
import logging
import sys
import json
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import config
from datetime import datetime
from flask import Flask
from threading import Thread, Lock
from collections import deque

# Google cloud configuration
PROJECT_ID = config.PROJECT_ID
SUBSCRIPTION_ID = config.SUBSCRIPTION_ID

# Google cloud access
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./service-account-key.json"

# MongoDB configuration
MONGO_URI = config.MONGO_URI
DB_NAME = "order-db"
COLLECTION_NAME = "orders"

mongo_client = MongoClient(MONGO_URI, server_api=ServerApi('1'), tls=True)
db = mongo_client[DB_NAME]
collection = db[COLLECTION_NAME]

# In-memory cache for cold start deduplication
processing_message_ids = set()
cache_lock = Lock()

# Logging
google_logging_client = google.cloud.logging.Client()
google_logging_client.setup_logging()

logger=logging.getLogger(__name__)
logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)

# Process incoming messages
def callback(message):
    try:
        order_data = json.loads(message.data.decode("utf-8")) 
        logger.info(f"Received order: {order_data}")

        if "timestamp" in order_data:
            order_data["timestamp"] = convert_date(order_data["timestamp"])

        handled_data = handle_duplicates(order_data)

        # Attempt to save to MongoDB
        if save_to_mongo(handled_data):
            message.ack()
            logger.info(f"Message acknowledged.\n")
        else:
            message.nack()
            logger.info(f"Message not acknowledged: {handled_data}\n")

    except Exception as e:
        logger.info(f"Error processing message: {e}")
        message.nack() 

# Check if message is duplicate and mark as such
def handle_duplicates(order_message):

    order_message_id = order_message["message_id"]

    # Cache duplicate detection
    with cache_lock:
        if order_message_id in processing_message_ids:
            order_message["isDuplicate"] = True
            logger.info("Duplicate message found in cache.")
            return order_message
        
        # Add to processing set
        processing_message_ids.add(order_message_id)
        
    # MongoDB duplicate detection
    query = { "message_id": order_message_id}
    query_count = collection.count_documents(query)
    
    logger.info(f"Query count: {query_count}")

    if query_count > 0:
        order_message["isDuplicate"] = True
        logger.info("Duplicate message found in MongoDB.")
    else:
        order_message["isDuplicate"] = False
        logger.info("Order was original.")

    return order_message

# Convert date string to datetime object
def convert_date(date_str):
    if date_str[-1] != "Z":
        date_str += "Z"
    try:
        return datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%fZ")
    except ValueError:
        logger.info(f"Date format error: {date_str}")
        return None

# Save order data to MongoDB
def save_to_mongo(order):
    try:
        collection.insert_one(order)
        logger.info(f"\nOrder saved to MongoDB: {order}")
    except Exception as e:
        logger.error(f"Error saving to MongoDB: {e}")
        return False
    finally:
        with cache_lock:
            processing_message_ids.discard(order["message_id"])
    return True

app = Flask(__name__)

@app.route("/")
def health_check():
    return "OK", 200

def start_flask():
    app.run(host="0.0.0.0", port=8080)

if __name__ == "__main__":
    flask_thread = Thread(target=start_flask)
    flask_thread.daemon = True
    flask_thread.start()
    
    # Ensure google auth variable is set
    if not os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
        raise EnvironmentError("GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.")

    # Initialize subscriber client
    subscriber = pubsub_v1.SubscriberClient()
    subscription_path = subscriber.subscription_path(PROJECT_ID, SUBSCRIPTION_ID)

    logger.info(f"Listening for messages on {subscription_path}...")

    # Subscribe to the topic and listen for messages
    streaming_pull_future = subscriber.subscribe(subscription_path, callback=callback)

    try:
        streaming_pull_future.result()  # Keeps the subscriber listening indefinitely
    except KeyboardInterrupt:
        streaming_pull_future.cancel() 
        logger.info("Subscriber stopped.")
    finally:
        google_logging_client.logger("shutdown").info("Flushing and closing Cloud Logging client.")
        google_logging_client.close()