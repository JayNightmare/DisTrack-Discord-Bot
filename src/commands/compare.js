// src/commands/compare.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const User = require('../models/User');
const { formatTime } = require('../utils/formatTime');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('compare')
        .setDescription("Compare your coding stats with another user.")
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to compare with.')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const targetUser = interaction.options.getUser('target');
            const userId = interaction.user.id;

            const user = await User.findOne({ userId });
            const target = await User.findOne({ userId: targetUser.id });

            if (!user || !target) {
                return await interaction.reply("Could not retrieve data for one or both users.");
            }

            const embed = new EmbedBuilder()
                .setColor('#FF8C00')
                .setTitle("👥 Coding Comparison")
                .addFields(
                    { name: `${interaction.user.username}`, value: `Total Time: ${formatTime(user.totalCodingTime)}`, inline: true },
                    { name: `${targetUser.username}`, value: `Total Time: ${formatTime(target.totalCodingTime)}`, inline: true }
                )
                .setFooter({ text: "Keep coding to surpass your friends!" });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Error comparing users:", error);
            await interaction.reply("There was an error comparing profiles.");
        }
    }
};
