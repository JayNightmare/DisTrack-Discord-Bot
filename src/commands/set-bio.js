const { SlashCommandBuilder } = require('@discordjs/builders');
const { getUserData, registerUser, updateUserBio } = require('../services/userServices.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-bio')
        .setDescription('Set a custom bio for your profile (Premium only)')
        .addStringOption(option =>
            option.setName('bio')
                .setDescription('Enter your bio text')
                .setRequired(true)
        ),

    async execute(interaction) {
        const userId = interaction.user.id;
        const username = interaction.user.username;
        const bioText = interaction.options.getString('bio');

        try {
            // Register user if they don't exist and retrieve user data
            let user = await registerUser(userId, username);
            user = await getUserData(userId);

            // Check if the user has premium access
            if (!user.premium) {
                return await interaction.reply({
                    content: "This command is a premium feature! Upgrade to premium to set a custom bio.",
                    ephemeral: true
                });
            }

            // Update the bio in the user's profile
            await updateUserBio(userId, bioText);

            // Confirmation embed
            const bioSetEmbed = new EmbedBuilder()
                .setColor('#00FF7F')
                .setTitle("Bio Updated Successfully!")
                .setDescription(`Your bio has been updated to:\n\n"${bioText}"`)
                .setFooter({ text: "Use /profile to view your updated profile!" });

            await interaction.reply({ embeds: [bioSetEmbed] });

        } catch (error) {
            console.error("Error setting bio:", error);
            await interaction.reply({
                content: "There was an error setting your bio. Please try again later.",
                ephemeral: true
            });
        }
    }
};
