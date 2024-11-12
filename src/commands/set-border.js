const { SlashCommandBuilder } = require('@discordjs/builders');
const { generateBorderedAvatar } = require('../utils/generateBorderedAvatar');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-border')
        .setDescription('Set a border for your profile thumbnail (Premium only)')
        .addStringOption(option =>
            option.setName('border')
                .setDescription('Select a border')
                .setRequired(true)
                .addChoices(
                    { name: 'Bunny', value: 'bunny.png' },
                    { name: 'Frame', value: 'frame.png' },
                    { name: 'Cool Border', value: 'cool_border.png' }
                    // Add more choices based on available borders
                )
        ),

    async execute(interaction) {
        const targetUser = interaction.user;
        const avatarUrl = targetUser.displayAvatarURL({ format: 'png', size: 128 });
        const selectedBorder = interaction.options.getString('border');

        try {
            // Generate the combined avatar with selected border
            const borderedAvatarBuffer = await generateBorderedAvatar(avatarUrl, selectedBorder);

            // Create an embed to display the bordered avatar
            const embed = new EmbedBuilder()
                .setColor('#1d5b5b')
                .setTitle(`${targetUser.username}'s Profile with Border`)
                .setThumbnail('attachment://borderedAvatar.png')
                .setDescription('Your selected border has been applied!');

            // Send the embed with the image file
            await interaction.reply({
                embeds: [embed],
                files: [{ attachment: borderedAvatarBuffer, name: 'borderedAvatar.png' }]
            });
        } catch (error) {
            console.error("Error applying border:", error);
            await interaction.reply({
                content: 'There was an error applying the border. Please try again later.',
                ephemeral: true
            });
        }
    }
};
