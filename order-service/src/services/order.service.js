const axios = require("axios");
const Order = require("../models/Order");
const { publishOrderCreated } = require("./rabbitmq.service");

const USER_SERVICE_URL = "http://user-service:3001";

function createHttpError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

async function createOrderRecord({ userId, items, totalAmount }) {
    if (!userId || !Array.isArray(items) || items.length === 0 || totalAmount === undefined) {
        throw createHttpError("userId, items and totalAmount are required", 400);
    }

    let user;
    try {
        const response = await axios.get(`${USER_SERVICE_URL}/users/${userId}`);
        user = response.data;
    } catch (_error) {
        throw createHttpError("invalid userId", 400);
    }

    const order = await Order.create({ userId, items, totalAmount, status: "CREATED" });

    publishOrderCreated({
        orderId: order._id.toString(),
        userId: order.userId,
        userEmail: user.email,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt
    });

    return order;
}

function findOrderById(orderId) {
    return Order.findById(orderId);
}

module.exports = {
    createOrderRecord,
    findOrderById
};
