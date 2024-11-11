// src/commands/profile.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { registerUser, getUserData, updateAchievements } = require('../services/userServices.js');
const {
    checkForCodingAchievements,
    checkForStreakAchievements,
    checkForLanguageAchievements,
    getNextMilestone
} = require('../utils/checkMilestones.js');
const { formatTime } = require('../utils/formatTime.js');
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
            let user = await registerUser(userId, username);

            // Check for new achievements in each category
            const newCodingAchievements = await checkForCodingAchievements(user);
            const newStreakAchievements = await checkForStreakAchievements(user);
            const newLanguageAchievements = await checkForLanguageAchievements(user);

            const allNewAchievements = [
                ...newCodingAchievements,
                ...newStreakAchievements,
                ...newLanguageAchievements
            ];

            if (allNewAchievements.length > 0) {
                await updateAchievements(userId, allNewAchievements);
                user = await getUserData(userId); // Refetch user data
            }

            // Separate formatted strings for each achievement category
            const codingTimeAchievements = user.achievements
                .filter(a => a.category === 'time')
                .map(a => `• ${a.name}: ${a.description}`)
                .join('\n') || "No coding time milestones yet.";

            console.log(user.achievements);

            const languageAchievements = user.achievements
                .filter(a => a.category === 'language')
                .map(a => `• ${a.name}: ${a.description}`)
                .join('\n') || "No language milestones yet.";

            const streakAchievements = user.achievements
                .filter(a => a.category === 'streak')
                .map(a => `• ${a.name}: ${a.description}`)
                .join('\n') || "No streak achievements yet.";

            // Filter and format language stats
            const languageStats = Object.entries(user.languages)
                .filter(([_, time]) => time > 0)  // Only include languages with non-zero time
                .map(([lang, time]) => `• ${capitalizeFirstLetter(lang)}: ${formatTime(time)}`)
                .join('\n') || "No language data recorded";

            // Calculate time stats
            const totalCodingTime = formatTime(user.totalCodingTime || 0);
            const dailyCodingStreak = user.currentStreak || 0;
            const longestStreak = user.longestStreak || 0;
            const lastSession = user.lastSessionDate ? new Date(user.lastSessionDate).toLocaleString() : "No recent session";

            // Milestones and progress bar
            const nextMilestone = getNextMilestone(user.totalCodingTime || 0);
            const progressToNextMilestone = Math.min(((user.totalCodingTime % nextMilestone.target) / nextMilestone.target) * 100, 100);
            const milestoneText = `• ${nextMilestone.name} (${formatTime(nextMilestone.target)})\n\n📈 Progress: ${progressToNextMilestone.toFixed(1)}%`;

            // Create the embed
            const embed = new EmbedBuilder()
                .setColor('#1d5b5b')
                .setTitle(`${userDisplayName}'s Coding Profile`)
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .addFields(
                    { name: "🕒 Total Coding Time", value: totalCodingTime, inline: true },
                    { name: "🔥 Current Streak", value: `${dailyCodingStreak} days`, inline: true },
                    { name: "🏆 Longest Streak", value: `${longestStreak} days`, inline: true },
                    { name: "⏱️ Last Session", value: lastSession, inline: false },
                    { name: "🔣 Languages", value: languageStats, inline: false },
                    { name: "🌟 Coding Time Milestones", value: codingTimeAchievements, inline: true },
                    { name: "🗂️ Language Milestones", value: languageAchievements, inline: true },
                    { name: "🔥 Streak Achievements", value: streakAchievements, inline: true },
                    { name: "🎯 Next Achievement", value: milestoneText, inline: false }
                )
                .setFooter({ text: "Keep coding and reach new milestones! 💻" });

            // Send the embed
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Error fetching profile:", error);
            await interaction.reply({
                content: "There was an error fetching your profile",
                ephemeral: true,
            });
        }
    }
};

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
