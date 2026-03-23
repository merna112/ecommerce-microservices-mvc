const { listNotifications } = require("../services/notification.service");

async function getNotifications(_req, res) {
    try {
        const notifications = await listNotifications();
        return res.status(200).json(notifications);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getNotifications
};
