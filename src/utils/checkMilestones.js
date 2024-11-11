const fs = require('fs');
const path = require('path');

function loadAchievements(fileName) {
    const filePath = path.join(__dirname, '../data', fileName);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

// Load achievements from JSON files
const codingAchievements = loadAchievements('../milestones/codingAch.json');
const streakAchievements = loadAchievements('../milestones/streakAch.json');
const languageAchievements = loadAchievements('../milestones/languageAch.json');

// Function to check if user has reached a new coding milestone
async function checkForCodingAchievements(user) {
    const newAchievements = [];

    for (const milestone of codingAchievements) {
        const hasAchievement = user.achievements.some(a => a.name === milestone.name);
        if (user.totalCodingTime >= milestone.target && !hasAchievement) {
            newAchievements.push(milestone);
        }
    }

    return newAchievements;
}

// Function to check if user has reached a new streak milestone
async function checkForStreakAchievements(user) {
    const newAchievements = [];

    for (const milestone of streakAchievements) {
        const hasAchievement = user.achievements.some(a => a.name === milestone.name);
        if (user.longestStreak >= milestone.target && !hasAchievement) {
            newAchievements.push(milestone);
        }
    }

    return newAchievements;
}

// Function to check if user has reached a new language-specific milestone
async function checkForLanguageAchievements(user) {
    const newAchievements = [];

    for (const milestone of languageAchievements) {
        const hasAchievement = user.achievements.some(a => a.name === milestone.name);
        const userLanguageTime = user.languages[milestone.language] || 0;
        if (userLanguageTime >= milestone.target && !hasAchievement) {
            newAchievements.push(milestone);
        }
    }

    return newAchievements;
}

// Function to get the next milestone based on total coding time (optional if needed)
function getNextMilestone(totalTime) {
    return codingAchievements.find(m => totalTime < m.target) || codingAchievements[codingAchievements.length - 1];
}

module.exports = {
    checkForCodingAchievements,
    checkForStreakAchievements,
    checkForLanguageAchievements,
    getNextMilestone
};
