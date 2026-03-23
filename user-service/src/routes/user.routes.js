const express = require("express");
const { createUser, getUserById } = require("../controllers/user.controller");

const router = express.Router();

router.post("/users", createUser);
router.get("/users/:id", getUserById);

module.exports = router;
