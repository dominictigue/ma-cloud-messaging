const express = require("express")
const database = require("./connect")
const ObjectId = require("mongodb").ObjectId

let orderRoutes = express.Router()

// Retrieve All with Filters
orderRoutes.route("/orders").get(async (request, response) => {
    const { searchQuery, sortOption, dupeFilter } = request.query;
    let db = database.getDb();

    console.log("Received query parameters:", { searchQuery, sortOption, dupeFilter });

    let query = {};
    if (searchQuery) {
        query.$or = [
            { order_id: { $regex: searchQuery, $options: "i" } },
            { customer: { $regex: searchQuery, $options: "i" } },
        ];
    }

    if (dupeFilter === "hideDupes") {
        query.isDuplicate = false;
    }

    let sort = {};
    if (sortOption === "time") {
        sort.timestamp = -1;
    } else if (sortOption === "customer") {
        sort.customer = 1; 
    } else if (sortOption === "orderNum") {
        sort.order_id = 1; 
    } else if (sortOption === "itemCount") {
        sort.items = -1; 
    } else {
        sort = { timestamp: -1 }; // Default sort by timestamp descending
    }

    console.log("Query:", query);
    console.log("Sort:", sort);

    try {
        let data = await db.collection("orders").find(query).sort(sort).toArray();
        console.log("Fetched data:", data);
        response.json(data);
    } catch (error) {
        console.error("Error fetching orders:", error);
        response.status(500).send(`Error fetching orders: ${error.message}`);
    }
});

// Retrieve One
orderRoutes.route("/orders/:id").get(async (request, response) => {
    let db = database.getDb()
    let data = await db.collection("orders").findOne({_id: new ObjectId(request.params.id)})
    if (Object.keys(data).length > 0) {
        response.json(data)
    } else {
        throw new Error("Data was not found.")
    }
})

// Create One
orderRoutes.route("/orders").post(async (request, response) => {
    let db = database.getDb()
    let mongoObject = {
        order_id: request.body.order_id,
        customer: request.body.customer,
        items: request.body.items,
        total: request.body.total,
        timestamp: request.body.timestamp
    }
    let data = await db.collection("orders").insertOne(mongoObject)
    response.json(data)
})
// Update One
orderRoutes.route("/orders/:id").put(async (request, response) => {
    let db = database.getDb()
    let mongoObject = {
        $set: {
            order_id: request.body.order_id,
            customer: request.body.customer,
            items: request.body.items,
            total: request.body.total,
            timestamp: request.body.timestamp
        }
    }
    let data = await db.collection("orders").updateOne({_id: new ObjectId(request.params.id)}, mongoObject)
    response.json(data)
})
// Delete One
orderRoutes.route("/orders/:id").delete(async (request, response) => {
    let db = database.getDb()
    let data = await db.collection("orders").deleteOne({_id: new ObjectId(request.params.id)}, mongoObject)
    response.json(data)
})

module.exports = orderRoutes