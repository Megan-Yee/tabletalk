const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { register, login, getAllUsers } = require("../controllers/user");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/users").get(authMiddleware, getAllUsers);

module.exports = router;
