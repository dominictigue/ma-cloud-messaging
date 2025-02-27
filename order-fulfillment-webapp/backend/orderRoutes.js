const express = require("express")
const database = require("./connect")
const ObjectId = require("mongodb").ObjectId

let orderRoutes = express.Router()

// Retrieve All
orderRoutes.route("/orders").get(async (request, response) => {
    let db = database.getDb()
    let data = await db.collection("orders").find({}).toArray()
    if (data.length > 0) {
        response.json(data)
    } else {
        throw new Error("Data was not found.")
    }
})

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