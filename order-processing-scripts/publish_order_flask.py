from flask import Flask, request, redirect, url_for, flash, render_template
from google.cloud import pubsub_v1
import json
import os
import uuid
from datetime import datetime

app = Flask(__name__)
app.config.from_pyfile('config.py')

# Set up Google Cloud Pub/Sub
PROJECT_ID = "silent-scholar-448520-h2"
TOPIC_ID = "ma-order-processing-topic"

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
            timestamp = datetime.now()
        else:
            timestamp_str = request.form.get("timestamp")
            if not timestamp_str:
                timestamp = datetime.now()
            else: 
                try:
                    timestamp = datetime.strptime(timestamp_str, "%Y-%m-%d %H:%M:%S")
                except ValueError:
                    flash("Invalid timestamp format. Use ISO 8601 format (e.g., '2025-01-01T12:00:00').", "danger")
                    return redirect(url_for("index"))
        
        # Split up items field
        items = [item.strip() for item in items_str.split(",") if item.strip()]
        
        order = {
            "message_id": message_id,
            "order_id": order_id,
            "customer": customer,
            "items": items,
            "total": float(total) if total else 0,
            "timestamp": timestamp.isoformat()
        }
        
        try:
            pubsub_message_id = publish_order(order)
            flash(f"Published message ID: {pubsub_message_id}", "success")
        except Exception as e:
            flash(f"Error publishing message: {e}", "danger")
        
        return redirect(url_for("index"))
    
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True)

