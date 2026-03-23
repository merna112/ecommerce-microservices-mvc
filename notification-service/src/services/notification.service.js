const Notification = require("../models/Notification");

function listNotifications() {
    return Notification.find().sort({ createdAt: -1 });
}

async function createOrderCreatedNotification(eventData) {
    const { orderId, userId, userEmail, totalAmount } = eventData;

    return Notification.create({
        type: "ORDER_CREATED",
        recipient: userEmail || userId,
        message: `Order ${orderId} created successfully. Total amount: ${totalAmount}`,
        payload: eventData,
        status: "SENT"
    });
}

module.exports = {
    listNotifications,
    createOrderCreatedNotification
};
