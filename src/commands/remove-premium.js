const { SlashCommandBuilder } = require('@discordjs/builders');
const { WebhookClient, EmbedBuilder } = require('discord.js');
const { registerUser, getUserData, updateUserPremiumStatus, updateUserSponsorStatus } = require('../services/userServices.js'); // Update the import path as needed
require('dotenv').config();

const webhook = new WebhookClient({ url: process.env.PREMIUM_REMOVAL_REQUEST_WH });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-premium')
        .setDescription('Remove premium access from a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to remove premium access from.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('choice')
                .setDescription('Sponsor or Premium')
                .setRequired(true)
                .addChoices(
                    { name: 'Sponsor', value: 'sponsor' },
                    { name: 'Premium', value: 'premium' }
                )
        ),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');
        const userId = targetUser.id;

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

            await webhook.send({ embeds: [wh_embed] });
            return await interaction.reply({ embeds: [user_embed] });
        }

        try {
            const choice = interaction.options.getString('choice');

            // Fetch and update user data
            let user = await registerUser(userId, targetUser.username);
            user = await getUserData(userId);

            if (choice === 'sponsor') {
                if (user.sponsor) {
                    await updateUserSponsorStatus(userId, false);

                    // Remove the sponsor badge
                    user.badges = user.badges.filter(badge => badge.name !== 'Sponsor');
                    await user.save();

                    await interaction.reply(`<@${targetUser.id}> (User ID: ${targetUser.id}) has had sponsor access removed.`);
                } else {
                    await interaction.reply(`<@${targetUser.id}> (User ID: ${targetUser.id}) does not have sponsor access.`);
                }
            } else if (choice === 'premium') {
                if (user.premium) {
                    await updateUserPremiumStatus(userId, false);

                    // Remove the premium badge
                    user.badges = user.badges.filter(badge => badge.name !== 'Premium');
                    await user.save();

                    await interaction.reply(`<@${targetUser.id}> (User ID: ${targetUser.id}) has had premium access removed.`);
                } else {
                    await interaction.reply(`<@${targetUser.id}> (User ID: ${targetUser.id}) does not have premium access.`);
                }
            }
        } catch (error) {
            console.error("Error removing premium:", error);
            await interaction.reply("There was an error removing premium access. Please try again later.");
        }
    }
};
