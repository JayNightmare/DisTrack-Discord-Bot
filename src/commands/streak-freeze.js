const { SlashCommandBuilder } = require('@discordjs/builders');
const { registerUser, getUserData, updateUserStreak } = require('../services/userServices.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('freeze-streak')
        .setDescription("Freeze your streak to prevent it from resetting for 24 hours (Premium only)"),

    async execute(interaction) {
        const userId = interaction.user.id;
        const username = interaction.user.username;

        try {
            let user = await registerUser(userId, username);
            user = await getUserData(userId);

            // Check if the user has premium access
            if (!user.premium) {
                return await interaction.reply({
                    content: "This command is a premium feature! Upgrade to premium to access the streak freeze feature.",
                    ephemeral: true
                });
            }

            const currentDate = new Date();
            const freezeTill = user.lastSessionDate || currentDate; // Defaults to 1970-01-01 if no previous freeze
            const cooldownPeriod = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

            // If it's been less than 30 days since the last freeze, calculate days remaining
            if (currentDate < freezeTill && currentDate - freezeTill < cooldownPeriod) {
                const daysRemaining = Math.ceil((cooldownPeriod - (currentDate - freezeTill)) / (24 * 60 * 60 * 1000));
                return await interaction.reply({
                    content: `Your streak freeze is on cooldown! Please wait ${daysRemaining} more day(s) to use it again.`,
                    ephemeral: true
                });
            }

            // Set the `freezeTill` date to 24 hours from now
            user.lastSessionDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
            await updateUserStreak(userId, user.currentStreak, user.lastSessionDate);

            const freezeEmbed = new EmbedBuilder()
                .setColor('#1d5b5b')
                .setTitle("❄️ Streak Freeze Activated! ❄️")
                .setDescription("Your streak is now frozen until this time tomorrow. Remember to check back in!")
                .setFooter({ text: "Premium users can use this feature once every 30 days." });

            await interaction.reply({ embeds: [freezeEmbed] });
        } catch (error) {
            console.error("Error activating streak freeze:", error);
            await interaction.reply({
                content: "There was an error activating your streak freeze. Please try again later.",
                ephemeral: true
            });
        }
    }
};
