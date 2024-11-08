// src/services/userService.js
const User = require('../models/User');

async function registerUser(userId, username) {
    let user = await User.findOne({ userId });
    if (!user) {
        user = await User.create({ userId, username });
        console.log(`New user registered: ${username}`);
    }
    return user;
}

async function updateUserCodingTime(userId, additionalTime) {
    const user = await User.findOne({ userId });
    if (!user) throw new Error("User not found for updating coding time.");

    user.totalCodingTime += additionalTime;
    await user.save();
    console.log(`Updated coding time for ${user.username}: +${additionalTime} seconds`);
    return user;
}

module.exports = { registerUser, updateUserCodingTime };
