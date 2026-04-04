const mongoose = require("mongoose");
const crypto = require("crypto");

const OrganizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    inviteCode: { type: String, default: null },
    inviteCodeExpiry: { type: Date, default: null },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

OrganizationSchema.methods.generateInviteCode = function () {
  this.inviteCode = crypto.randomBytes(4).toString("hex").toUpperCase();
  this.inviteCodeExpiry = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
};

OrganizationSchema.methods.isInviteValid = function () {
  return this.inviteCode && this.inviteCodeExpiry && this.inviteCodeExpiry > new Date();
};

module.exports = mongoose.model("Organization", OrganizationSchema);
