const { SlashCommandBuilder } = require('@discordjs/builders');
const { generateBorderedAvatar } = require('../utils/generateBorderedAvatar');
const { updateUserBorder } = require('../services/userServices.js');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-border')
        .setDescription('Set a border for your profile thumbnail (Premium only)')
        .addStringOption(option =>
            option.setName('border')
                .setDescription('Select a border')
                .setRequired(true)
                .addChoices(
                    { name: 'Bunny', value: '../borders/bunny' },
                    { name: 'Evil Purple', value: '../borders/evil-purple' },
                    { name: 'Window View', value: '../borders/window-view' },
                    { name: 'XP Window', value: '../borders/xp-window'}
                )
        ),

    async execute(interaction) {
        const targetUser = interaction.user;
        const avatarUrl = targetUser.displayAvatarURL({ dynamic: true });
        const selectedBorder = interaction.options.getString('border');

        try {
            await interaction.deferReply();

            // Generate the combined avatar with selected border
            const borderedAvatarBuffer = await generateBorderedAvatar(avatarUrl, selectedBorder);
            if (borderedAvatarBuffer === null) return interaction.followUp(`Border needs to cooldown, try again later`);
            const attachment = new AttachmentBuilder(borderedAvatarBuffer, { name: 'profile_with_border.gif' });

            await updateUserBorder(targetUser.id, selectedBorder);

            // Create an embed to display the bordered avatar
            const embed = new EmbedBuilder()
                .setColor('#1d5b5b')
                .setTitle(`${targetUser.username}'s Profile with Border`)
                .setThumbnail('attachment://borderedAvatar.gif')
                .setDescription('Your selected border has been applied!');

            // Send the embed with the image file
            await interaction.followUp({
                embeds: [embed],
                files: [attachment]
            });
        } catch (error) {
            console.error("Error applying border:", error);
            await interaction.followUp({
                content: 'There was an error applying the border. Please try again later.',
                ephemeral: true
            });
        }
    }
};
