const User = require("../models/User");

function createUserRecord({ name, email }) {
    return User.create({ name, email });
}

function findUserById(userId) {
    return User.findById(userId);
}

module.exports = {
    createUserRecord,
    findUserById
};
