// src/commands/bug-report.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { WebhookClient, EmbedBuilder } = require('discord.js');
const { registerUser, getUserData, updateUserBadges } = require('../services/userServices.js');
require('dotenv').config();

const nWebhookClient = new WebhookClient({ url: process.env.BUG_REPORT_WH });
const pWebhookClient = new WebhookClient({ url: process.env.P_BUG_REPORT_WH });

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

            let userData = await registerUser(user.id, user.username);
            userData = await getUserData(user.id); // Refetch data

            const isPriority = userData.premium ? ' **[Priority]**' : '';

            // Create an embed for the bug report
            const bugReportEmbed = new EmbedBuilder()
                .setColor(importanceLevel === 'OMG LOOK!! 🚨' ? '#FF0000' :
                          importanceLevel === 'High 🔴' ? '#FF4500' :
                          importanceLevel === 'Medium 🟡' ? '#FFD700' :
                          '#32CD32') // Color based on importance level
                .setTitle(`🐞 New Bug Report${isPriority} 🐞`)
                .addFields(
                    { name: 'Reporter', value: `<@${user.id}>\n(user ID: ${user.id})`, inline: true },
                    { name: 'Importance Level', value: importanceLevel, inline: true },
                    { name: 'Description', value: bugDescription }
                )
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setFooter({ text: 'Bug Report System' });
    
            // Send the embed to the webhook
            if (user.premium) await nWebhookClient.send({ embeds: [bugReportEmbed] });
            else await pWebhookClient.send({ embeds: [bugReportEmbed] });

            const badgeName = userData.premium ? 'Priority Bug Finder' : 'Bug Finder';
            const badgeIcon = userData.premium ? '<:prioritybugreporter:1305629236375195668>' : '<:bugfinder:1305559725244551168>';
            if (!userData.badges.some(badge => badge.name === badgeName)) {
                await updateUserBadges(user.id, { name: badgeName, icon: badgeIcon, dateEarned: new Date() });
            }
    
            // Confirm to the user
            await interaction.reply({
                content: `Your bug report has been submitted as **${importanceLevel}**. Thank you for helping us improve!`,
                ephemeral: true
            });
        }
};
