const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { registerAdmin, generateInviteCode, getMembers, getMyOrgs } = require("../controllers/organization");

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Access denied. Admins only." });
  next();
};

router.route("/register-admin").post(authMiddleware, registerAdmin);
router.route("/generate-code").post(authMiddleware, adminOnly, generateInviteCode);
router.route("/members").get(authMiddleware, adminOnly, getMembers);
router.route("/my-orgs").get(authMiddleware, getMyOrgs);

module.exports = router;
