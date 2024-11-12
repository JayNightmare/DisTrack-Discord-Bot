const { SlashCommandBuilder } = require('@discordjs/builders');
const { WebhookClient, EmbedBuilder } = require('discord.js');
const { registerUser, getUserData, updateUserPremiumStatus, updateUserSponsorStatus } = require('../services/userServices.js'); // Update these paths as needed
require('dotenv').config();

const webhook = new WebhookClient({ url: process.env.PREMIUM_CONFIRM_REQUEST_WH });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-premium')
        .setDescription('Grant premium access to a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to grant premium access to.')
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
                if (!user.sponsor) {
                    await updateUserSponsorStatus(userId, true);

                    // add sponsor badge to user
                    const sponsorBadge = {
                        name: 'Sponsor',
                        icon: '<:sponsor:1305558116624236595>', // Replace with actual sponsor emoji ID
                        dateEarned: new Date()
                    };

                    user.badges.push(sponsorBadge);
                    await user.save();

                    await interaction.reply(`<@${targetUser.id}> (User ID: ${targetUser.id}) has been granted sponsor access.`);
                } else { await interaction.reply(`<@${targetUser.id}> (User ID: ${targetUser.id}) already has sponsor access.`); }
            } else if (choice === 'premium') {
                if (!user.premium) {
                    await updateUserPremiumStatus(userId, true);

                    // add premium badge to user
                    const premiumBadge = {
                        name: 'Premium',
                        icon: '<:premium:1305673552837738567>', // Replace with actual premium emoji ID
                        dateEarned: new Date()
                    };

                    user.badges.push(premiumBadge);
                    await user.save();

                    await interaction.reply(`<@${targetUser.id}> (User ID: ${targetUser.id}) has been granted premium access.`);
                } else { await interaction.reply(`<@${targetUser.id}> (User ID: ${targetUser.id}) already has premium access.`); }
            }
        } catch (error) {
            console.error("Error adding premium:", error);
            await interaction.reply("There was an error granting premium access. Please try again later.");
        }
    }
};
