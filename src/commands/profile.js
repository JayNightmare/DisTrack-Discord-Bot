// src/commands/profile.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { registerUser } = require('../services/userServices.js');
const { sendEmbed } = require('../utils/sendEmbed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription("Displays the user's coding profile"),
    async execute(interaction) {
        try {
            const userId = interaction.user.id;
            const username = interaction.user.username;

            // Register user if they don't exist and retrieve user data
            const user = await registerUser(userId, username);

            const achievements = user.achievements.map(a => `${a.name}: ${a.description}`).join('\n') || "No achievements yet.";
            const description = `Total Coding Time: ${user.totalCodingTime} seconds\n\nAchievements:\n${achievements}`;
            
            sendEmbed(interaction, `${interaction.user.displayName}'s Profile`, description);
        } catch (error) {
            console.error("Error fetching profile:", error);
            sendEmbed(interaction, "Error", "There was an error fetching your profile.");
        }
    }
};
