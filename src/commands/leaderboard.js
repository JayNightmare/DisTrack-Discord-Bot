// src/commands/leaderboard.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { sendEmbed } = require('../utils/sendEmbed');
const User = require('../models/User'); // Assuming you have a User schema

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays the top users based on coding time'),
    async execute(interaction) {
        try {
            const topUsers = await User.find().sort({ totalCodingTime: -1 }).limit(10);
            const leaderboard = topUsers.map((user, index) => `${index + 1}. ${user.username}: ${user.totalCodingTime} hrs`).join('\n');
            
            sendEmbed(interaction, "Leaderboard", leaderboard || "No data available.");
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            sendEmbed(interaction, "Error", "Could not fetch leaderboard.");
        }
    },
};
