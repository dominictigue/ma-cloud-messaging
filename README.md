# ma-cloud-messaging

## Overview
An end-to-end cloud messaging system designed to process e-commerce order messages for order fulfillment using Google Pub/Sub. The system includes message publishing, subscribing, database integration, and a user interface for message management.

## System Architecture
The system consists of the following components:
| #  | Component |	Description | 
| --- | ---       | ---          | 
| 1	  | Order Publisher Endpoint | A Python script that sends order messages to a Google Pub/Sub topic. Will be deployed to Google Cloud Run. |
| 2	| Order Processing Topic | The messaging system where order messages are published. Will be hosted by Google Pub/Sub.	| 
| 3	| Order Processing Subscription | The subscription that listens to messages from the topic. Will be hosted by Google Pub/Sub. |	
| 4	| Subscriber Endpoint | A Python script that listens to the Pub/Sub topic, processes messages, and saves them to MongoDB. Will be deployed to on Google Cloud Run. | 
| 5	| Database (MongoDB) | Stores the order data received from the Pub/Sub subscriber. Will be hosted by MongoDB Atlas. | 
| 6	| Backend API (Express.js) | Serves as a middle layer to provide data access to the frontend. Will be deployed to Google Cloud Run. |	
| 7	| Frontend (React.js) | A user interface that retrieves and displays orders from the database. Will be deployed to Google Cloud Run. | 

### Technical Workflow
![Technical workflow](./documentation/images/technical-workflow.PNG?raw=true "Technical Workflow")

### File Structure
`order-processing-scripts`
Python files that are used for communicating with Google Pub/Sub and MongoDB.
* Order Publisher Endpoint (1)
* Subscriber Endpoint (4)

`order-fulfillment-webapp`
MERN stack WebApp, displays the orders from MongoDB in a React UI.
* Backend API (Express.js) (6)
* Frontend (React.js) (7)

## Schema
| Field       | From                    | Type     | Description |
|-------------|-------------------------|----------|-------------|
| `_id`       | MongoDB (5)             | ObjectID | Unique MongoDB identifier. |
| `messageId` | Pubsub Topic (2)        | String   | Google Pubsub Message Field. Assigned by the server when the message is published. Used for duplicate detection. |
| `order_id`  | Initial order           | String   | Unique order ID; used to match order updates or cancellations with the original order. |
| `customer`  | Initial order           | String   | Name of the customer who placed the order. |
| `items`     | Initial order           | Array    | Array of the items ordered. |
| `total`     | Initial order           | Double   | Total cost of items ordered. |
| `timestamp` | Initial order           | String   | The time the order message was made. |
| `isDuplicate` | Subscriber Endpoint (4) | Boolean  | Whether this message is marked as duplicate or not. Assigned by the order subscriber endpoint. Used by the Consumer UI to differentiate duplicate orders. |
| `status`    | Express (6)             | String   | The status of the fulfillment: In-progress, Processed, Hold, etc. This field is created by the Express backend of the fulfillment app when warehouse staff initiates a fulfillment. It will change as the warehouse staff progresses the fulfillment. |
| `assignee`  | Express (6)             | String   | The name of the warehouse staff assigned to fulfilling the order. Created by the Express backend when warehouse staff initiates a fulfillment. |


