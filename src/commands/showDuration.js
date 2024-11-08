// src/commands/showDuration.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { sendEmbed } = require('../utils/sendEmbed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('showduration')
        .setDescription('Displays your coding session duration'),
    async execute(interaction, userSessionData) {
        try {
            const userId = interaction.user.id;
            const duration = userSessionData[userId];
            if (duration) {
                sendEmbed(interaction, "Coding Session Duration", `You coded for ${duration} seconds.`);
            } else {
                sendEmbed(interaction, "No Data", "No coding session data found for you.");
            }
        } catch (error) {
            console.error("Error displaying duration:", error);
            sendEmbed(interaction, "Error", "An error occurred while retrieving your coding data.");
        }
    },
};
