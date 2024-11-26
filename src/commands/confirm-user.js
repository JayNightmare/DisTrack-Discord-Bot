const { SlashCommandBuilder } = require('@discordjs/builders');
const { WebhookClient, EmbedBuilder } = require('discord.js');
const { registerUser, getUserData } = require('../services/userServices.js');
require('dotenv').config();

const approvedWebhook = new WebhookClient({ url: process.env.PREMIUM_CONFIRM_REQUEST_WH });
const deniedWebhook = new WebhookClient({ url: process.env.PREMIUM_REMOVAL_REQUEST_WH });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('confirm-user')
        .setDescription('Request premium access by entering your GitHub username.')
        .addStringOption(option =>
            option.setName('user-id')
                .setDescription('User\'s ID')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('action')
            .setDescription('Approve or reject user')
            .setRequired(true)
            .addChoices(
                { name: 'Approve', value: 'approve' },
                { name: 'Reject', value: 'reject' }
            )
        ),
    async execute(interaction, client) {
        const userId = interaction.options.getString('user-id');
        const action = interaction.options.getString('action');
        const user = await getUserData(userId);

        if (interaction.user.id !== process.env.OWNER_ID) {
            const user_embed = new EmbedBuilder()
                .setTitle('Unauthorized Action Attempted')
                .setDescription(`Nuh uh! You don't have permission to use this command!\n\n**💯 This action has been reported to the bot owner 💯**`)
                .setColor('#ff0000')
                .setTimestamp();

            const wh_embed = new EmbedBuilder()
                .setTitle('Unauthorized Action Attempted')
                .setDescription(`User <@${interaction.user.id}> (User ID: ${interaction.user.id}) attempted to grant premium access to <@${targetUser.id}> (User ID: ${targetUser.id})`)
                .setColor('#ff0000')
                .setTimestamp();

            await deniedWebhook.send({ embeds: [wh_embed] });
            return await interaction.reply({ embeds: [user_embed], ephemeral: true });
        }

        if (!user) {
            return interaction.reply({ content: 'User not found. Save a session first and try again.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('Premium Access Request')
            .addFields(
                { name: 'User ID', value: userId },
                { name: 'Action', value: action }
            );

        if (action === 'approve') {
            await registerUser(userId, user.username);
            embed.setDescription(`Your premium request has been approved!`).setColor('#46c9b0');
            await approvedWebhook.send({ embeds: [embed] });

        } else if (action === 'reject') {
            embed.setDescription(`Your premium request has been rejected.\nTo be approved, sponsor the bot on github -> https://github.com/sponsors/JayNightmare`).setColor('#f8312f');
            await deniedWebhook.send({ embeds: [embed] });
        }

        // Send DM to the user
        try {
            const targetUser = await client.users.fetch(userId);
            await targetUser.send({ embeds: [embed] });

            interaction.reply({ content: `Action ${action} completed and user has been notified via DM.`, ephemeral: true });
        } catch (error) {
            console.error('Failed to send DM:', error);

            interaction.reply({ content: `Action ${action} completed but failed to notify the user via DM.`, ephemeral: true });
        }
    }
};
