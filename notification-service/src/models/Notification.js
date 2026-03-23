const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        type: { type: String, required: true },
        recipient: { type: String, required: true },
        message: { type: String, required: true },
        payload: { type: Object },
        status: { type: String, default: "SENT" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
