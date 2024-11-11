const fs = require('fs').promises;
const path = require('path');

async function loadAchievements() {
    const files = ['../milestones/codingAch.json', '../milestones/streakAch.json', '../milestones/languageAch.json'];
    let achievements = [];

    for (const file of files) {
        try {
            const data = await fs.readFile(path.join(__dirname, `../data/${file}`), 'utf-8');
            achievements = achievements.concat(JSON.parse(data));
        } catch (error) {
            console.error(`Error loading achievements from ${file}:`, error);
        }
    }

    return achievements;
}

module.exports = { loadAchievements };
