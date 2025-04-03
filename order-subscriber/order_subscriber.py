from google.cloud import pubsub_v1
import json
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import config
from datetime import datetime

# Google cloud configuration
PROJECT_ID = config.PROJECT_ID
SUBSCRIPTION_ID = config.SUBSCRIPTION_ID

# Google cloud access
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./service-account-key.json"

# MongoDB configuration
MONGO_URI = config.MONGO_URI
DB_NAME = "order-db"
COLLECTION_NAME = "orders"

client = MongoClient(MONGO_URI, server_api=ServerApi('1'))
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# Process incoming messages
def callback(message):
    try:
        order_data = json.loads(message.data.decode("utf-8")) 
        print(f"Received order: {order_data}")

        if "timestamp" in order_data:
            order_data["timestamp"] = convert_date(order_data["timestamp"])

        handled_data = handle_duplicates(order_data)

        save_to_mongo(handled_data)

        message.ack()

        print(f"Message acknowledged.\nOrder saved to MongoDB: {handled_data}")
    except Exception as e:
        print(f"Error processing message: {e}")
        message.nack() 

# Check if message is duplicate and mark as such
def handle_duplicates(order_message):

    order_message_id = order_message["message_id"]

    query = { "message_id": order_message_id}

    query_count = collection.count_documents(query)
    
    print(f"Query count: {query_count}")

    if query_count > 0:
        order_message["isDuplicate"] = True
        print("Order marked as duplicate.")
    else:
        order_message["isDuplicate"] = False
        print("Order was original.")

    return order_message

# Convert date string to datetime object
def convert_date(date_str):
    if date_str[-1] != "Z":
        date_str += "Z"

    try:
        return datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%fZ")
    except ValueError:
        print(f"Date format error: {date_str}")
        return None

# Save order data to MongoDB
def save_to_mongo(order):
    try:
        collection.insert_one(order)
    except Exception as e:
        print(f"Error saving to MongoDB: {e}")

if __name__ == "__main__":
    # Ensure google auth variable is set
    if not os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
        raise EnvironmentError("GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.")

    # Initialize subscriber client
    subscriber = pubsub_v1.SubscriberClient()
    subscription_path = subscriber.subscription_path(PROJECT_ID, SUBSCRIPTION_ID)

    print(f"Listening for messages on {subscription_path}...")

    # Subscribe to the topic and listen for messages
    streaming_pull_future = subscriber.subscribe(subscription_path, callback=callback)

    try:
        streaming_pull_future.result()  # Keeps the subscriber listening indefinitely
    except KeyboardInterrupt:
        streaming_pull_future.cancel() 
        print("Subscriber stopped.")
