const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (user) =>
  jwt.sign({ id: user._id, name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: "30d" });

const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ msg: "Please provide name, email, and password" });

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ msg: "Email already in use" });

  const user = new User({ name: username, email, password });
  await user.save();

  const token = generateToken(user);
  return res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: "Please provide email and password" });

  const foundUser = await User.findOne({ email });
  if (!foundUser) return res.status(400).json({ msg: "Invalid credentials" });

  const isMatch = await foundUser.comparePassword(password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const token = generateToken(foundUser);
  return res.status(200).json({ token, user: { id: foundUser._id, name: foundUser.name, email: foundUser.email, role: foundUser.role } });
};

const getAllUsers = async (req, res) => {
  const users = await User.find({}, "name email role");
  return res.status(200).json({ users });
};

module.exports = { register, login, getAllUsers };
