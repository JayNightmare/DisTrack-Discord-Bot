const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    username: { type: String },
    totalCodingTime: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    achievements: { type: [String], default: [] },
    lastSessionDate: { type: Date, default: null }, // New field to track last coding session date
});

module.exports = mongoose.model("User", userSchema);
