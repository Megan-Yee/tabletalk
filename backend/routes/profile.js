const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { getProfile, createProfile, updateProfile, joinOrg } = require("../controllers/profile");

router.route("/").get(authMiddleware, getProfile).post(authMiddleware, createProfile).put(authMiddleware, updateProfile);
router.route("/join-org").post(authMiddleware, joinOrg);

module.exports = router;
