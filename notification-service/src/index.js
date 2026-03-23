const mongoose = require("mongoose");
const app = require("./app");
const { initializeMailer } = require("./services/mailer.service");
const { startConsumer } = require("./services/notification.consumer");

const PORT = 3003;
const MONGODB_URI = "mongodb://notification-db:27017/notificationsdb";
async function start() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to notification database");

        await initializeMailer();
        await startConsumer();

        app.listen(PORT, () => {
            console.log(`notification-service listening on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start notification-service:", error.message);
        process.exit(1);
    }
}

start();
