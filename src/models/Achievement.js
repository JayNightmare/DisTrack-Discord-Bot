// src/models/Achievement.js
const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    requiredHours: { type: Number, required: true }, // Required coding hours to achieve this milestone
    dateAchieved: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Achievement", achievementSchema);
