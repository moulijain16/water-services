const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const makeToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: "Username already taken" });

    const user = await User.create({ username, password });
    res.status(201).json({ token: makeToken(user._id), username: user.username });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid username or password" });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: "Invalid username or password" });

    res.json({ token: makeToken(user._id), username: user.username });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;