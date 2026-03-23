const amqp = require("amqplib");
const { sendOrderCreatedEmail } = require("./mailer.service");
const { createOrderCreatedNotification } = require("./notification.service");

const RABBITMQ_URL = "amqp://rabbitmq:5672";
const ORDER_EVENTS_QUEUE = "order-events";
const RABBITMQ_RETRY_DELAY_MS = 5000;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startConsumer() {
    let channel;

    while (!channel) {
        try {
            const connection = await amqp.connect(RABBITMQ_URL);
            channel = await connection.createChannel();
        } catch (error) {
            console.error(`RabbitMQ not ready, retrying in ${RABBITMQ_RETRY_DELAY_MS}ms:`, error.message);
            await sleep(RABBITMQ_RETRY_DELAY_MS);
        }
    }

    await channel.assertQueue(ORDER_EVENTS_QUEUE, { durable: true });
    console.log(`Waiting for messages in queue: ${ORDER_EVENTS_QUEUE}`);

    channel.consume(ORDER_EVENTS_QUEUE, async (message) => {
        if (!message) {
            return;
        }

        try {
            const event = JSON.parse(message.content.toString());

            if (event.eventType === "order.created") {
                const { orderId, userEmail, totalAmount } = event.data;

                if (userEmail) {
                    await sendOrderCreatedEmail({
                        recipientEmail: userEmail,
                        orderId,
                        totalAmount
                    });
                }

                await createOrderCreatedNotification(event.data);
                console.log(`Notification created for order ${orderId}`);
            }

            channel.ack(message);
        } catch (error) {
            console.error("Failed to process event:", error.message);
            channel.nack(message, false, false);
        }
    });
}

module.exports = {
    startConsumer
};
