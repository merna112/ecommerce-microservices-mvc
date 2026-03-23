const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        items: [
            {
                productId: { type: String, required: true },
                quantity: { type: Number, required: true, min: 1 }
            }
        ],
        totalAmount: { type: Number, required: true, min: 0 },
        status: { type: String, default: "CREATED" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
