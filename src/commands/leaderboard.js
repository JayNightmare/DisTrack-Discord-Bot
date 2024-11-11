// src/commands/leaderboard.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { formatTime } = require('../utils/formatTime');
const User = require('../models/User.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays the top coders with the most time tracked.'),
    async execute(interaction) {
        try {
            const topUsers = await User.find().sort({ totalCodingTime: -1 }).limit(10);
            const leaderboard = topUsers.map((user, index) => 
                `#${index + 1} - **${user.username}**: ${formatTime(user.totalCodingTime)}`
            ).join('\n');

            const embed = new EmbedBuilder()
                .setColor('#FFD700')
                .setTitle("🏆 Coding Leaderboard 🏆")
                .setDescription(leaderboard)
                .setFooter({ text: "Keep coding to climb the leaderboard!" });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            await interaction.reply("There was an error retrieving the leaderboard.");
        }
    }
};