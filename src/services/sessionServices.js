// src/services/sessionService.js
const Session = require('../models/Session');
const User = require('../models/User');

async function logSession(userId, startTime, endTime, duration) {
    const user = await User.findOne({ userId });
    if (!user) throw new Error("User not found for session log.");

    const session = await Session.create({
        user: user._id,
        startTime,
        endTime,
        duration,
    });

    console.log(`Session logged for ${user.username} with duration ${duration} seconds.`);
    return session;
}

module.exports = { logSession };
