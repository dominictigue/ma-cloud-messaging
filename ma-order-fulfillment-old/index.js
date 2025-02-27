const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('ma-order-fulfillment-app/dist'));
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

app.get('/api/test/:order_id', (req, res) => {
    const order_id = req.params.order_id;
    const test = getTest(order_id);
    if (!test) {
        res.status(404).send({error: `test ${order_id} not found`});
    }
    else {
        res.send({data: test});
    }
})

function getTest(order_id) {
    const tests = [
        {order_id: 12345,
        customer: "John Doe",
        items: ["Laptop", "Mouse"],
        total: 1200.00,
        timestamp: "2025-01-28T12:00:00Z"}
    ];
    return tests.find(t => t.order_id == order_id);
}