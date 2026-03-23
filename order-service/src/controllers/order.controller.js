const { createOrderRecord, findOrderById } = require("../services/order.service");

async function createOrder(req, res) {
    try {
        const order = await createOrderRecord(req.body);
        return res.status(201).json(order);
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
    }
}

async function getOrderById(req, res) {
    try {
        const order = await findOrderById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "order not found" });
        }
        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createOrder,
    getOrderById
};
