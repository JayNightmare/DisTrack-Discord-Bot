const { SlashCommandBuilder } = require('@discordjs/builders');
const { WebhookClient, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const webhook = new WebhookClient({ url: process.env.PREMIUM_REQUEST_REPORT_WH });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('confirm-premium')
        .setDescription('Request premium access by entering your GitHub username.')
        .addStringOption(option =>
            option.setName('github_username')
                .setDescription('Your GitHub username to verify sponsorship.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const githubUsername = interaction.options.getString('github_username');
        const userId = interaction.user.id;
        const username = interaction.user.username;

        let user = await registerUser(userId, username);
            user = await getUserData(userId);

        const embed = new EmbedBuilder()
            .setTitle('Premium Access Request')
            .setDescription(`User ${username} has requested premium access.`)
            .addFields(
                { name: 'Discord Username', value: `<@${userId}>\n${username}\n(${userId})`, inline: true },
                { name: 'GitHub Username', value: githubUsername, inline: true },
                { name: 'Status', value: 'Pending Review' }
            )
            .setColor('#f1c40f')
            .setTimestamp();

        try {
            await webhook.send({ embeds: [embed] });
            await interaction.reply({
                content: "Your premium request has been submitted! The dev team will review it shortly.",
                ephemeral: true
            });
        } catch (error) {
            console.error("Error sending webhook:", error);
            await interaction.reply({
                content: "There was an error submitting your request. Please try again later.",
                ephemeral: true
            });
        }
    }
};
