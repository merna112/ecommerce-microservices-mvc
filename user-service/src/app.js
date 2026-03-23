const express = require("express");
const userRoutes = require("./routes/user.routes");

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
    res.status(200).json({ service: "user-service", status: "UP" });
});

app.use(userRoutes);

module.exports = app;
