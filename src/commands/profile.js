// src/commands/profile.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { registerUser, updateAchievements } = require('../services/userServices.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription("Displays the user's coding profile")
        .addUserOption(option =>
            option.setName('user')
                .setDescription("The user whose profile you want to view (Accepts User Mention and User ID)")
                .setRequired(false)
        ),
    async execute(interaction) {
        try {
            const targetUser = interaction.options.getUser('user') || interaction.user;
            const userId = targetUser.id;
            const username = targetUser.username;
            const userDisplayName = targetUser.displayName;

            // Register user if they don't exist and retrieve user data
            const user = await registerUser(userId, username);

            const newAchievement = await checkForAchievements(user);
            if (newAchievement) {
                await updateAchievements(userId, newAchievement);
            }

            const languageStats = Object.entries(user.languages)
                .filter(([_, time]) => time > 0)  // Only include languages with non-zero time
                .map(([lang, time]) => `• ${capitalizeFirstLetter(lang)}: ${formatTime(time)}`)
                .join('\n') || "No language data recorded.";


            // Calculate time stats
            const totalCodingTime = formatTime(user.totalCodingTime || 0);
            const dailyCodingStreak = user.currentStreak || 0;
            const longestStreak = user.longestStreak || 0;
            const lastSession = user.lastSessionDate ? new Date(user.lastSessionDate).toLocaleString() : "No recent session";

            // Highlight recent achievements
            const achievements = user.achievements.map(a => `• ${a.name}: ${a.description}`).join('\n') || "No achievements yet.";
            
            // Milestones and progress bar
            const nextMilestone = getNextMilestone(user.totalCodingTime || 0);
            const progressToNextMilestone = Math.min(((user.totalCodingTime % nextMilestone.target) / nextMilestone.target) * 100, 100);
            // const progressBar = createProgressBar(progressToNextMilestone);

            const milestoneText = `• ${nextMilestone.name} (${formatTime(nextMilestone.target)})\n\n📈 Progress: ${progressToNextMilestone.toFixed(1)}%`;
            // %\n${progressBar}`;

            // Create the embed
            const embed = new EmbedBuilder()
                .setColor('#1d5b5b')
                .setTitle(`${userDisplayName}'s Coding Profile`)
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true })) // User's profile picture
                .setTimestamp()
                .addFields(
                    { name: "🕒 Total Coding Time", value: totalCodingTime, inline: true },
                    { name: "🔥 Current Streak", value: `${dailyCodingStreak} days`, inline: true },
                    { name: "🏆 Longest Streak", value: `${longestStreak} days`, inline: true },
                    { name: "⏱️ Last Session", value: lastSession, inline: false },
                    { name: "🔣 Languages", value: languageStats, inline: false },
                    { name: "🌟 Achievements", value: achievements, inline: false },
                    { name: "🎯 Next Achievement", value: milestoneText, inline: false }
                )
                .setFooter({ text: "Keep coding and reach new milestones! 💻"});

            // Send the embed
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Error fetching profile:", error);
            await interaction.reply({
                content: "There was an error fetching your profile.",
                ephemeral: true,
            });
        }
    }
};

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

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

// // Function to create a text-based progress bar
// function createProgressBar(progress) {
//     const totalBars = 10;
//     const filledBars = Math.round((progress / 100) * totalBars);
//     const emptyBars = totalBars - filledBars;
//     const progressBar = "█".repeat(filledBars) + "░".repeat(emptyBars); // Filled bars and empty bars
//     return `[${progressBar}] ${progress.toFixed(2)}%`;
// }

// Function to format time based on duration in seconds
function formatTime(seconds) {
    if (seconds >= 2 * 365 * 24 * 3600) { // more than 2 years
        return `${(seconds / (365 * 24 * 3600)).toFixed(2)} years`;
    } else if (seconds >= 24 * 3600) { // more than 1 day
        return `${(seconds / (24 * 3600)).toFixed(2)} days`;
    } else if (seconds >= 3600) { // more than 1 hour
        return `${(seconds / 3600).toFixed(2)} hours`;
    } else if (seconds >= 60) { // more than 1 minute
        return `${(seconds / 60).toFixed(2)} minutes`;
    } else {
        return `${seconds.toFixed(2)} seconds`;
    }
}
