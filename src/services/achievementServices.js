// src/services/achievementService.js
const Achievement = require('../models/Achievement');
const User = require('../models/User');

async function awardAchievement(userId, achievementName, requiredHours) {
    const user = await User.findOne({ userId });
    if (!user) throw new Error("User not found for achievement award.");

    const achievement = await Achievement.create({
        name: achievementName,
        description: `Achieved after coding ${requiredHours} hours.`,
        requiredHours,
    });

    user.achievements.push(achievement._id);
    await user.save();
    console.log(`Achievement awarded to ${user.username}: ${achievementName}`);
    return achievement;
}

module.exports = { awardAchievement };
