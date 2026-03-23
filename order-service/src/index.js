const mongoose = require("mongoose");
const app = require("./app");
const { connectToRabbitMQ } = require("./services/rabbitmq.service");

const PORT = 3002;
const MONGODB_URI = "mongodb://order-db:27017/ordersdb";
async function start() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to order database");

        await connectToRabbitMQ();

        app.listen(PORT, () => {
            console.log(`order-service listening on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start order-service:", error.message);
        process.exit(1);
    }
}

start();
