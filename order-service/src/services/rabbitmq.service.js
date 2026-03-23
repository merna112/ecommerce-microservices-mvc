const amqp = require("amqplib");

const RABBITMQ_URL = "amqp://rabbitmq:5672";
const ORDER_EVENTS_QUEUE = "order-events";
const RABBITMQ_RETRY_DELAY_MS = 5000;

let channel;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectToRabbitMQ() {
    while (!channel) {
        try {
            const connection = await amqp.connect(RABBITMQ_URL);
            const rabbitChannel = await connection.createChannel();
            await rabbitChannel.assertQueue(ORDER_EVENTS_QUEUE, { durable: true });
            channel = rabbitChannel;
            console.log("Connected to RabbitMQ");
        } catch (error) {
            console.error(`RabbitMQ not ready, retrying in ${RABBITMQ_RETRY_DELAY_MS}ms:`, error.message);
            await sleep(RABBITMQ_RETRY_DELAY_MS);
        }
    }
}

function publishOrderCreated(eventPayload) {
    if (!channel) {
        const error = new Error("RabbitMQ channel not initialized");
        error.statusCode = 503;
        throw error;
    }

    const event = {
        eventType: "order.created",
        data: eventPayload
    };

    channel.sendToQueue(ORDER_EVENTS_QUEUE, Buffer.from(JSON.stringify(event)), {
        persistent: true
    });
}

module.exports = {
    connectToRabbitMQ,
    publishOrderCreated
};
