// src/services/userService.js
const User = require('../models/User.js');

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
    if (!user) throw new Error("User not found for updating coding time");

    user.totalCodingTime += additionalTime;
    await user.save();
    console.log(`Updated coding time for ${user.username}: +${additionalTime} seconds`);
    return user;
}

async function updateAchievements(userId, achievements) {
    try {
        await User.findOneAndUpdate(
            { userId },
            { $addToSet: { achievements: { $each: achievements } } }, // `$addToSet` ensures no duplicates
            { new: true, runValidators: true }
        );
        console.log(`Achievements updated for user ${userId}:`, achievements);
    } catch (error) {
        console.error("Error updating achievements:", error);
    }
}


async function getUserData(userId) {
    try {
        const user = await User.findOne({ userId });
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }
        return user;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}

module.exports = { registerUser, updateUserCodingTime, updateAchievements, getUserData };
