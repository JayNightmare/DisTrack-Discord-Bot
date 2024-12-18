const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dev-request')
        .setDescription('Request to become a developer')
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Why do you want to become a developer?')
                .setRequired(true)),
    async execute(interaction) {
        const { user, options, client } = interaction;
        const reason = options.getString('reason');
        const encodedReason = encodeURIComponent(reason);

        // ID of the channel where the request should be sent
        const devRequestChannelId = process.env.DEV_CHANNEL_ID; // Replace with your channel ID
        const devRequestChannel = client.channels.cache.get(devRequestChannelId);

        if (!devRequestChannel) {
            return interaction.reply({
                content: "Dev request channel not found. Please contact the admins.",
                ephemeral: true
            });
        }

        // Create the embed
        const embed = new EmbedBuilder()
            .setTitle('🛠️ Developer Request')
            .setColor('#5865F2')
            .setDescription(`**User**: ${user.tag} (${user.id})\n**Reason**:\n\n${reason}\n\n**Status**: 🔄️ Pending`)
            .setTimestamp();

        // Create buttons
        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`accept_${user.id}_${encodedReason}`)
                    .setLabel('✅ Accept')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`deny_${user.id}_${encodedReason}`)
                    .setLabel('❌ Deny')
                    .setStyle(ButtonStyle.Danger),
            );

        // Send the embed and buttons to the dev request channel
        await devRequestChannel.send({
            embeds: [embed],
            components: [buttons]
        });

        await interaction.reply({
            content: "Your request has been sent to the dev team!",
            ephemeral: true
        });
    }
};
