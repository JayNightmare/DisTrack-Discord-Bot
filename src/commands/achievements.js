// src/commands/achievements.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { checkForAchievements, getNextMilestone } = require('../utils/checkMilestones.js');
const User = require('../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('achievements')
        .setDescription("Displays your coding achievements and milestones."),
    async execute(interaction) {
        try {
            const userId = interaction.user.id;
            const user = await User.findOne({ userId });

            if (!user) {
                return await interaction.reply("No achievements found. Start coding to unlock achievements!");
            }

            const achievements = user.achievements.map(a => `• ${a.name}: ${a.description}`).join('\n') || "No achievements yet.";
            const nextMilestone = getNextMilestone(user.totalCodingTime || 0);
            const progressToNextMilestone = ((user.totalCodingTime % nextMilestone.target) / nextMilestone.target) * 100;
            const milestoneText = `Next Milestone: **${nextMilestone.name}** - ${progressToNextMilestone.toFixed(1)}% complete`;

            const embed = new EmbedBuilder()
                .setColor('#1E90FF')
                .setTitle(`${interaction.user.username}'s Achievements`)
                .setDescription(achievements)
                .addFields({ name: "Milestone Progress", value: milestoneText, inline: false })
                .setFooter({ text: "Keep coding to unlock more!" });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Error fetching achievements:", error);
            await interaction.reply("There was an error retrieving your achievements.");
        }
    }
};
