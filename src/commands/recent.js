// src/commands/recent.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const User = require('../models/User');
const { formatTime } = require('../utils/formatTime');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('recent')
        .setDescription("Shows your recent coding activity"),
    async execute(interaction) {
        try {
            const userId = interaction.user.id;
            const user = await User.findOne({ userId });

            if (!user || !user.lastSessionDate) {
                return await interaction.reply("No recent activity found. Start coding to see your activity here!");
            }

            const lastSession = new Date(user.lastSessionDate).toLocaleString();
            const languageStats = Object.entries(user.languages)
                .filter(([, time]) => time > 0)
                .map(([lang, time]) => `• ${capitalize(lang)}: ${formatTime(time)}`)
                .join('\n') || "No language data recorded";

            const embed = new EmbedBuilder()
                .setColor('#32CD32')
                .setTitle(`${interaction.user.username}'s Recent Coding Activity`)
                .addFields(
                    { name: "Last Session", value: lastSession, inline: false },
                    { name: "Languages Used", value: languageStats, inline: false }
                )
                .setFooter({ text: "Keep coding to track more data!" });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Error fetching recent activity:", error);
            await interaction.reply("There was an error retrieving your recent activity");
        }
    }
};

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
