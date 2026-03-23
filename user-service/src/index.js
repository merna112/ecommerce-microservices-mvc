const mongoose = require("mongoose");
const app = require("./app");

const PORT = 3001;
const MONGODB_URI = "mongodb://user-db:27017/usersdb";

async function start() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to user database");
        app.listen(PORT, () => {
            console.log(`user-service listening on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start user-service:", error.message);
        process.exit(1);
    }
}

start();
