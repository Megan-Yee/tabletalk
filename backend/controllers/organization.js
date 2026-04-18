const Organization = require("../models/Organization");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (user) =>
  jwt.sign({ id: user._id, name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: "30d" });

const registerAdmin = async (req, res) => {
  const { orgName } = req.body;
  if (!orgName) return res.status(400).json({ msg: "Organization name is required" });

  const existing = await Organization.findOne({ name: { $regex: new RegExp(`^${orgName}$`, "i") } });
  if (existing) return res.status(400).json({ msg: "That organization name is already taken" });

  const alreadyAdmin = await Organization.findOne({ admin: req.user.id });
  if (alreadyAdmin) return res.status(400).json({ msg: "You are already an admin of an organization" });

  const updatedUser = await User.findByIdAndUpdate(req.user.id, { role: "admin" }, { new: true });

  const org = new Organization({ name: orgName, admin: req.user.id, members: [] });
  await org.save();

  const token = generateToken(updatedUser);
  return res.status(201).json({ msg: `Organization "${orgName}" created`, org, token });
};

const generateInviteCode = async (req, res) => {
  const org = await Organization.findOne({ admin: req.user.id });
  if (!org) return res.status(404).json({ msg: "No organization found for this admin" });

  org.generateInviteCode();
  await org.save();

  return res.status(200).json({ msg: "Invite code generated", inviteCode: org.inviteCode, expiresAt: org.inviteCodeExpiry });
};

const getMembers = async (req, res) => {
  const org = await Organization.findOne({ admin: req.user.id }).populate("members", "name email");
  if (!org) return res.status(404).json({ msg: "No organization found for this admin" });

  return res.status(200).json({
    org: { name: org.name, inviteCode: org.inviteCode, inviteCodeExpiry: org.inviteCodeExpiry, isInviteValid: org.isInviteValid() },
    members: org.members,
  });
};

const getMyOrgs = async (req, res) => {
  const orgs = await Organization.find({ members: req.user.id }, "name admin").populate("admin", "name email");
  return res.status(200).json({ orgs });
};

module.exports = { registerAdmin, generateInviteCode, getMembers, getMyOrgs };
