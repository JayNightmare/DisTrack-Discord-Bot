// Function to check if user has reached a new milestone
async function checkForAchievements(user) {
    const milestones = [
        { name: "Novice 🥉", target: 3600, description: "Reached 1 hour of coding" },
        { name: "Intermediate 🥈", target: 14400, description: "Reached 4 hours of coding" },
        { name: "Pro 🥇", target: 86400, description: "Reached 1 day of coding" },
        { name: "Expert 🏅", target: 172800, description: "Reached 2 days of coding" },
        { name: "Master 🏆", target: 604800, description: "Reached 1 week of coding" },
        { name: "Elite 👑", target: 2592000, description: "Reached 30 days of coding" },
        { name: "Legendary 🌟", target: 7776000, description: "Reached 90 days of coding" },
        { name: "Ultimate 🌠", target: 15552000, description: "Reached 180 days of coding" },
        { name: "Immortal 💻", target: 31104000, description: "Reached 1 year of coding" },
        { name: "Coding God ⚡", target: 62208000, description: "Reached 2 years of coding" }
    ];

    const newAchievements = [];
    
    // Loop through all milestones and add unachieved ones that meet the criteria
    for (const milestone of milestones) {
        const hasAchievement = user.achievements.some(a => a.name === milestone.name);
        if (user.totalCodingTime >= milestone.target && !hasAchievement) {
            newAchievements.push(milestone);
        }
    }
    return newAchievements;
}

// Function to get the next milestone based on total coding time
function getNextMilestone(totalTime) {
    const milestones = [
        { name: "Novice 🥉", target: 3600 }, // 1 hour
        { name: "Intermediate 🥈", target: 14400 }, // 4 hours
        { name: "Pro 🥇", target: 86400 }, // 1 day
        { name: "Expert 🏅", target: 172800 }, // 2 days
        { name: "Master 🏆", target: 604800 }, // 1 week
        { name: "Elite 👑", target: 2592000 }, // 30 days
        { name: "Legendary 🌟", target: 7776000 }, // 90 days
        { name: "Ultimate 🌠", target: 15552000 }, // 180 days
        { name: "Immortal 💻", target: 31104000 }, // 1 year
        { name: "Coding God ⚡", target: 62208000 } // 2 years
    ];

    return milestones.find(m => totalTime < m.target) || milestones[milestones.length - 1];
}

module.exports = {
    checkForAchievements,
    getNextMilestone
}