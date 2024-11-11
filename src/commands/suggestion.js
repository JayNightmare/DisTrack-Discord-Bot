const { SlashCommandBuilder } = require('@discordjs/builders');
const { WebhookClient, EmbedBuilder } = require('discord.js');
const { registerUser, getUserData, updateUserBadges } = require('../services/userServices.js');
require('dotenv').config();

const webhookClient = new WebhookClient({ url: process.env.SUGGESTION_REPORT_WH });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggestion')
        .setDescription('Submit a suggestion to the dev team')
        .addStringOption(option =>
            option.setName('suggestion')
                .setDescription('Your suggestion')
                .setRequired(true)
        ),

    async execute(interaction) {
        const suggestionText = interaction.options.getString('suggestion');
        const user = interaction.user;

        // Create an embed for the suggestion
        const suggestionEmbed = new EmbedBuilder()
            .setColor('#00BFFF') // Light blue for suggestions
            .setTitle('💡 New Suggestion 💡')
            .addFields(
                { name: 'Suggested by', value: `<@${user.id}>\n(user ID: ${user.id})`, inline: true },
                { name: 'Suggestion', value: suggestionText }
            )
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setFooter({ text: 'Suggestion System' });

        // Send the embed to the webhook
        await webhookClient.send({
            embeds: [suggestionEmbed]
        });

        // Register user if they don't exist and retrieve user data
        let userData = await registerUser(user.id, user.username);
        
        // Check and add badge
        userData = await getUserData(user.id);
        if (!userData.badges.some(badge => badge.name === 'Suggester')) {
            await updateUserBadges(user.id, { name: 'Suggester', icon: '🗣️', dateEarned: new Date() });
        }

        // Confirm to the user
        await interaction.reply({
            content: 'Thank you for your suggestion! It has been submitted to the dev team.',
            ephemeral: true
        });
    }
};
