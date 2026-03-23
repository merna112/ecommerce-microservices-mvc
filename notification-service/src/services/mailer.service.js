const nodemailer = require("nodemailer");

const MAIL_FROM = "no-reply@online-orders.local";

let mailTransporter;

async function initializeMailer() {
    const testAccount = await nodemailer.createTestAccount();
    mailTransporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });

    console.log("Nodemailer test account initialized");
}

async function sendOrderCreatedEmail({ recipientEmail, orderId, totalAmount }) {
    if (!mailTransporter) {
        const error = new Error("Mailer not initialized");
        error.statusCode = 503;
        throw error;
    }

    const info = await mailTransporter.sendMail({
        from: MAIL_FROM,
        to: recipientEmail,
        subject: "Your order has been created",
        text: `Order ${orderId} created successfully. Total amount: ${totalAmount}`
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
        console.log(`Email preview URL: ${previewUrl}`);
    }
}

module.exports = {
    initializeMailer,
    sendOrderCreatedEmail
};
