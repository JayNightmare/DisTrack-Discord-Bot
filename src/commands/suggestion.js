const { SlashCommandBuilder } = require('@discordjs/builders');
const { WebhookClient, EmbedBuilder } = require('discord.js');
const { registerUser, getUserData, updateUserBadges } = require('../services/userServices.js');
require('dotenv').config();

const nWebhookClient = new WebhookClient({ url: process.env.SUGGESTION_REPORT_WH });
const pWebhookClient = new WebhookClient({ url: process.env.P_SUGGESTION_REPORT_WH });

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

        // Register user if they don't exist and retrieve user data
        let userData = await registerUser(user.id, user.username);
        userData = await getUserData(user.id);

        const isPriority = userData.premium ? ' **[Priority]**' : '';

        // Create an embed for the suggestion
        const suggestionEmbed = new EmbedBuilder()
            .setColor('#00BFFF') // Light blue for suggestions
            .setTitle(`💡 New Suggestion${isPriority} 💡`)
            .addFields(
                { name: 'Suggested by', value: `<@${user.id}>\n(user ID: ${user.id})`, inline: true },
                { name: 'Suggestion', value: suggestionText }
            )
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setFooter({ text: 'Suggestion System' });

        // Send the embed to the webhook
        if (!userData.premium) await nWebhookClient.send({ embeds: [suggestionEmbed] });
        else if (userData.premium) await pWebhookClient.send({ embeds: [suggestionEmbed] });
        
        const badgeName = userData.premium ? 'Priority Suggester' : 'Suggester';
        const badgeIcon = userData.premium ? '<a:prioritysuggester:1305632491758948473>' : '✨';
        if (!userData.badges.some(badge => badge.name === badgeName)) {
            await updateUserBadges(user.id, { name: badgeName, icon: badgeIcon, dateEarned: new Date() });
        }

        // Confirm to the user
        await interaction.reply({
            content: 'Thank you for your suggestion! It has been submitted to the dev team.',
            ephemeral: true
        });
    }
};
