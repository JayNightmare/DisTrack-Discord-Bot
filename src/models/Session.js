// src/models/Session.js
const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true } // Duration in seconds
});

module.exports = mongoose.model("Session", sessionSchema);
