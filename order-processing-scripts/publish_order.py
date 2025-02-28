from google.cloud import pubsub_v1
import json
import os

# Set up Google Cloud Pub/Sub
PROJECT_ID = "silent-scholar-448520-h2"
TOPIC_ID = "ma-order-processing-topic"

# Google cloud access
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./service-account-key.json"

publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(PROJECT_ID, TOPIC_ID)

def publish_order(order_data):
    # Convert order data to JSON
    order_json = json.dumps(order_data).encode("utf-8")
    
    # Publish message
    future = publisher.publish(topic_path, order_json)
    print(f"Published message ID: {future.result()}")

# Example order message
order = {
    "order_id": "4",
    "customer": "New Test",
    "items": ["Item1", "Item2"],
    "total": 1200.00,
    "timestamp": "2025-02-27T12:00:00Z"
}

publish_order(order)
