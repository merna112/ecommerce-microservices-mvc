const express = require("express");
const notificationRoutes = require("./routes/notification.routes");

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
    res.status(200).json({ service: "notification-service", status: "UP" });
});

app.use(notificationRoutes);

module.exports = app;
