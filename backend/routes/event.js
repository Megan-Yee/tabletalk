const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { getMyEvents, getOrgEvents, createEvent, updateEvent, deleteEvent } = require("../controllers/event");

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Access denied. Admins only." });
  next();
};

// User routes
router.route("/my-events").get(authMiddleware, getMyEvents);

// Admin routes
router.route("/").post(authMiddleware, adminOnly, createEvent);
router.route("/org-events").get(authMiddleware, adminOnly, getOrgEvents);
router.route("/:id").put(authMiddleware, adminOnly, updateEvent).delete(authMiddleware, adminOnly, deleteEvent);

module.exports = router;
