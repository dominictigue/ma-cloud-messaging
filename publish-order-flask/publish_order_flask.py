from flask import Flask, request, redirect, url_for, flash, render_template
from google.cloud import pubsub_v1
import json
import os
import uuid
import config as config
from datetime import datetime

app = Flask(__name__)
app.config.from_pyfile('config.py')

# Set up Google Cloud Pub/Sub
PROJECT_ID = config.PROJECT_ID
TOPIC_ID = config.TOPIC_ID

# Get Google Cloud credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./service-account-key.json"

publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(PROJECT_ID, TOPIC_ID)

def publish_order(order_data):
    order_json = json.dumps(order_data).encode("utf-8")
    future = publisher.publish(topic_path, order_json)
    return future.result()

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        # Message ID toggling
        auto_generate = request.form.get("auto_generate", "false")
        if auto_generate.lower() == "true":
            message_id = str(uuid.uuid4())
        else:
            message_id = request.form.get("message_id")
            if message_id == "":
                message_id = str(uuid.uuid4())
        
        order_id = request.form.get("order_id")
        customer = request.form.get("customer")
        items_str = request.form.get("items")
        total = request.form.get("total")
        
        # Timestamp toggling
        auto_generate_timestamp = request.form.get("auto_generate_timestamp", "false")
        if auto_generate_timestamp.lower() == "true":
            timestamp = str(datetime.now().isoformat())
        else:
            timestamp = request.form.get("timestamp")
            if timestamp == "":
                timestamp = str(datetime.now().isoformat())
                
        
        # Split up items field
        items = [item.strip() for item in items_str.split(",") if item.strip()]
        

        order = {
            "message_id": message_id,
            "order_id": order_id,
            "customer": customer,
            "items": items,
            "total": float(total) if total else 0,
            "timestamp": timestamp
        }
        
        print(f"Order data: {order}")

        try:
            pubsub_message_id = publish_order(order)
            flash(f"Published message ID: {pubsub_message_id}", "success")
        except Exception as e:
            flash(f"Error publishing message: {e}", "danger")
        
        return redirect(url_for("index"))
    
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True)

