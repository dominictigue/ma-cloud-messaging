const express = require("express")
const database = require("./connect")
const ObjectId = require("mongodb").ObjectId

let orderRoutes = express.Router()

// Retrieve All with Filters
orderRoutes.route("/orders").get(async (request, response) => {
    const { searchQuery, sortOption, dupeFilter, dateFilter } = request.query;
    let db = database.getDb();

    console.log("Received query parameters:", { searchQuery, sortOption, dupeFilter, dateFilter });

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

    if (dateFilter) {
        const today = new Date();
        let startDate, endDate;

        switch (dateFilter) {
            case "today":
                startDate = new Date(today.setHours(0, 0, 0, 0));
                endDate = new Date(today.setHours(23, 59, 59, 999));
                break;
            case "yesterday":
                startDate = new Date(today.setDate(today.getDate() - 1));
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(today.setHours(23, 59, 59, 999));
                break;
            case "lastWeek":
                startDate = new Date(today.setDate(today.getDate() - 7));
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date();
                break;
            case "lastMonth":
                startDate = new Date(today.setMonth(today.getMonth() - 1));
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date();
                break;
            default:
                // Custom date in format "MM/DD/YYYY,MM/DD/YYYY"
                const startCustomDate = new Date(dateFilter.split(",")[0]);
                const endCustomDate = new Date(dateFilter.split(",")[1]);

                if (!isNaN(startCustomDate) && !isNaN(endCustomDate)) {
                    startDate = new Date(startCustomDate.setHours(0, 0, 0, 0));
                    endDate = new Date(endCustomDate.setHours(23, 59, 59, 999));

                    startDate.setDate(startCustomDate.getDate() + 1);
                    endDate.setDate(endCustomDate.getDate() + 1);
                }
                break;
        }

        if (startDate && endDate) {
            query.timestamp = { $gte: startDate, $lt: endDate };
        }
    }


    let sort = {};
    if (sortOption) {
        const [field, order] = sortOption.split(":"); 
        const sortOrder = order === "desc" ? -1 : 1; 
        if (field === "time") {
            sort = { timestamp: sortOrder };
        } else if (field === "customer") {
            sort = { customer: sortOrder };
        } else if (field === "orderNum") {
            sort = { order_id: sortOrder };
        } else if (field === "itemCount") {
            sort = { items: sortOrder };
        } else {
            sort = { timestamp: -1 };
        }
    }

    console.log("Query:", query);
    console.log("Sort:", sort);

    try {
        let data;

        // Check if sorting by itemCount
        if (sortOption && sortOption.startsWith("itemCount")) {
            const [field, order] = sortOption.split(":");
            const sortOrder = order === "desc" ? -1 : 1;

            // Use aggregation to count items and sort by itemCount
            data = await db.collection("orders")
                .aggregate([
                    { $match: query },
                    { $addFields: { itemCount: { $size: "$items" } } }, 
                    { $sort: { itemCount: sortOrder } } 
                ])
                .toArray();
        } else {
            // Regular sort otherwise
            data = await db.collection("orders").find(query).sort(sort).toArray();
        }

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