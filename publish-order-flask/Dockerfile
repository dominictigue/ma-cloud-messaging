# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container
COPY . /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port the app runs on
EXPOSE 8080

# Set environment variables
ENV FLASK_APP=publish_order_flask.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/service-account-key.json

# Use Gunicorn to serve the Flask app
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8080", "publish_order_flask:app"]