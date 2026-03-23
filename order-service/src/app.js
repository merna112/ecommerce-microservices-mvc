const express = require("express");
const orderRoutes = require("./routes/order.routes");

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
    res.status(200).json({ service: "order-service", status: "UP" });
});

app.use(orderRoutes);

module.exports = app;
