const Profile = require("../models/Profile");
const Organization = require("../models/Organization");

const getProfile = async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id }).populate("organizations", "name");
  if (!profile) return res.status(404).json({ msg: "Profile not found" });
  return res.status(200).json({ profile });
};

const createProfile = async (req, res) => {
  const existing = await Profile.findOne({ user: req.user.id });
  if (existing) return res.status(400).json({ msg: "Profile already exists. Use PUT to update." });

  const { gender, age, budget, personalityType, hobbies, allergies, orgCode } = req.body;

  const profile = new Profile({
    user: req.user.id,
    gender,
    age,
    budget,
    personalityType,
    hobbies: hobbies || [],
    allergies: allergies && allergies.length > 0 ? allergies : ["None"],
    isComplete: true,
  });

  if (orgCode) {
    const org = await Organization.findOne({ inviteCode: orgCode.toUpperCase() });
    if (!org || !org.isInviteValid())
      return res.status(400).json({ msg: "Invalid or expired invite code" });
    if (!org.members.includes(req.user.id)) { org.members.push(req.user.id); await org.save(); }
    profile.organizations.push(org._id);
  }

  await profile.save();
  return res.status(201).json({ profile });
};

const updateProfile = async (req, res) => {
  const { gender, age, budget, personalityType, hobbies, allergies } = req.body;
  const profile = await Profile.findOneAndUpdate(
    { user: req.user.id },
    { gender, age, budget, personalityType, hobbies, allergies, isComplete: true },
    { new: true, runValidators: true }
  );
  if (!profile) return res.status(404).json({ msg: "Profile not found" });
  return res.status(200).json({ profile });
};

const joinOrg = async (req, res) => {
  const { orgCode } = req.body;
  if (!orgCode) return res.status(400).json({ msg: "Please provide an invite code" });

  const org = await Organization.findOne({ inviteCode: orgCode.toUpperCase() });
  if (!org || !org.isInviteValid())
    return res.status(400).json({ msg: "Invalid or expired invite code" });

  const profile = await Profile.findOne({ user: req.user.id });
  if (!profile) return res.status(404).json({ msg: "Profile not found" });
  if (profile.organizations.includes(org._id))
    return res.status(400).json({ msg: "You are already a member of this organization" });

  profile.organizations.push(org._id);
  await profile.save();
  if (!org.members.includes(req.user.id)) { org.members.push(req.user.id); await org.save(); }

  return res.status(200).json({ msg: `Joined ${org.name} successfully`, org });
};

module.exports = { getProfile, createProfile, updateProfile, joinOrg };
