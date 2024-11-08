// src/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    totalCodingTime: { type: Number, default: 0 }, // Total time in seconds
    currentStreak: { type: Number, default: 0 },   // Days coded consecutively
    longestStreak: { type: Number, default: 0 },
    achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Achievement" }]
});

module.exports = mongoose.model("User", userSchema);
