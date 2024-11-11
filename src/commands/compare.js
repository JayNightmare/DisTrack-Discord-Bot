// src/commands/compare.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const User = require('../models/User');
const { formatTime } = require('../utils/formatTime');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('compare')
        .setDescription("Compare your coding stats with another user")
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to compare with')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const targetUser = interaction.options.getUser('target');
            const userId = interaction.user.id;

            const user = await User.findOne({ userId });
            const target = await User.findOne({ userId: targetUser.id });

            if (!user || !target) {
                return await interaction.reply("Could not retrieve data for one or both users");
            }

            // Prepare languages and achievements for display
            const userLanguages = Object.entries(user.languages)
                .filter(([, time]) => time > 0)
                .map(([lang, time]) => `• ${capitalize(lang)}: ${formatTime(time)}`)
                .join('\n') || "No language data recorded";

            const targetLanguages = Object.entries(target.languages)
                .filter(([, time]) => time > 0)
                .map(([lang, time]) => `• ${capitalize(lang)}: ${formatTime(time)}`)
                .join('\n') || "No language data recorded";

            const userAchievements = user.achievements.map(a => `• ${a.name}: ${a.description}`).join('\n') || "No achievements yet";
            const targetAchievements = target.achievements.map(a => `• ${a.name}: ${a.description}`).join('\n') || "No achievements yet";

            const embed = new EmbedBuilder()
                .setColor('#FF8C00')
                .setTitle("👥 Coding Comparison")
                .addFields(
                    { name: `${interaction.user.displayName} - Total Time`, value: formatTime(user.totalCodingTime), inline: true },
                    { name: `${targetUser.displayName} - Total Time`, value: formatTime(target.totalCodingTime), inline: true },
                    { name: '\u200B', value: '\u200B' },
                    { name: `${interaction.user.displayName} - Languages Used`, value: userLanguages, inline: true },
                    { name: `${targetUser.displayName} - Languages Used`, value: targetLanguages, inline: true },
                    { name: '\u200B', value: '\u200B' },
                    { name: `${interaction.user.displayName} - Achievements`, value: userAchievements, inline: true },
                    { name: `${targetUser.displayName} - Achievements`, value: targetAchievements, inline: true }
                )
                .setFooter({ text: "Keep coding to surpass your friends!" });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Error comparing users:", error);
            await interaction.reply("There was an error comparing profiles");
        }
    }
};

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}