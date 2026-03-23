const { createUserRecord, findUserById } = require("../services/user.service");

async function createUser(req, res) {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ message: "name and email are required" });
        }

        const user = await createUserRecord({ name, email });
        return res.status(201).json(user);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "email already exists" });
        }
        return res.status(500).json({ message: error.message });
    }
}

async function getUserById(req, res) {
    try {
        const user = await findUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createUser,
    getUserById
};
