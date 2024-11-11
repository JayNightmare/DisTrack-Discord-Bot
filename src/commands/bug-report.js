// src/commands/bug-report.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { WebhookClient, EmbedBuilder } = require('discord.js');
const { registerUser, getUserData, updateUserBadges } = require('../services/userServices.js');
require('dotenv').config();

const webhookClient = new WebhookClient({ url: process.env.BUG_REPORT_WH });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bug-report')
        .setDescription('Report a bug to the dev team with an importance level')
        .addStringOption(option =>
            option.setName('bug')
                .setDescription('Describe the bug you encountered')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('importance')
                .setDescription('How critical is this bug?')
                .setRequired(true)
                .addChoices(
                    { name: 'Low', value: 'Low 🟢' },
                    { name: 'Medium', value: 'Medium 🟡' },
                    { name: 'High', value: 'High 🔴' },
                    { name: 'OMG LOOK!!', value: 'OMG LOOK!! 🚨' }
                )
        ),
    
        async execute(interaction) {
            const bugDescription = interaction.options.getString('bug');
            const importanceLevel = interaction.options.getString('importance');
            const user = interaction.user;
    
            // Create an embed for the bug report
            const bugReportEmbed = new EmbedBuilder()
                .setColor(importanceLevel === 'OMG LOOK!! 🚨' ? '#FF0000' :
                          importanceLevel === 'High 🔴' ? '#FF4500' :
                          importanceLevel === 'Medium 🟡' ? '#FFD700' :
                          '#32CD32') // Color based on importance level
                .setTitle('🐞 New Bug Report 🐞')
                .addFields(
                    { name: 'Reporter', value: `<@${user.id}>\n(user ID: ${user.id})`, inline: true },
                    { name: 'Importance Level', value: importanceLevel, inline: true },
                    { name: 'Description', value: bugDescription }
                )
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setFooter({ text: 'Bug Report System' });
    
            // Send the embed to the webhook
            await webhookClient.send({
                embeds: [bugReportEmbed]
            });

            // Register user if they don't exist and retrieve user data
            let userData = await registerUser(user.id, user.username);

            // Check and add badge
            userData = await getUserData(user.id);
            if (!userData.badges.some(badge => badge.name === 'Bug Finder')) {
                await updateUserBadges(user.id, { name: 'Bug Finder', icon: '<:bugfinder:1305559725244551168>', dateEarned: new Date() });
            }
    
            // Confirm to the user
            await interaction.reply({
                content: `Your bug report has been submitted as **${importanceLevel}**. Thank you for helping us improve!`,
                ephemeral: true
            });
        }
};
