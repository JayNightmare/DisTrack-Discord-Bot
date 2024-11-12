const { SlashCommandBuilder } = require('@discordjs/builders');
const { registerUser, getUserData, updateAchievements } = require('../services/userServices.js');
const {
    checkForCodingAchievements,
    checkForStreakAchievements,
    checkForLanguageAchievements,
    getNextMilestone
} = require('../utils/checkMilestones.js');
const { formatTime } = require('../utils/formatTime.js');
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription("Displays the user's coding profile")
        .addUserOption(option =>
            option.setName('user')
                .setDescription("The user whose profile you want to view (Accepts User Mention and User ID)")
                .setRequired(false)
        ),
    async execute(interaction) {
        try {
            const targetUser = interaction.options.getUser('user') || interaction.user;
            const userId = targetUser.id;
            const username = targetUser.username;
            const userDisplayName = targetUser.displayName;

            // Register user if they don't exist and retrieve user data
            let user = await registerUser(userId, username);

            // Check for new achievements in each category
            const newCodingAchievements = await checkForCodingAchievements(user);
            const newStreakAchievements = await checkForStreakAchievements(user);
            const newLanguageAchievements = await checkForLanguageAchievements(user);

            const allNewAchievements = [
                ...newCodingAchievements,
                ...newStreakAchievements,
                ...newLanguageAchievements
            ];

            if (allNewAchievements.length > 0) {
                await updateAchievements(userId, allNewAchievements);
                user = await getUserData(userId); // Refetch user data
            }

            // Separate formatted strings for each achievement category
            const timeAchievements = user.achievements
                .filter(a => a.category === 'time')
                .map(a => `• ${a.name}: ${a.description}`)
                .join('\n') || "No coding time milestones yet.";

            const languageAchievements = user.achievements
                .filter(a => a.category === 'language')
                .map(a => `• ${a.name}: ${a.description}`)
                .join('\n') || "No language milestones yet.";

            const streakAchievements = user.achievements
                .filter(a => a.category === 'streak')
                .map(a => `• ${a.name}: ${a.description}`)
                .join('\n') || "No streak achievements yet.";

            // Calculate time stats
            const totalCodingTime = formatTime(user.totalCodingTime || 0);
            const dailyCodingStreak = user.currentStreak || 0;
            const longestStreak = user.longestStreak || 0;
            const lastSession = user.lastSessionDate ? new Date(user.lastSessionDate).toLocaleString() : "No recent session";

            // Premium Check: Only show language stats for premium users
            const languageStats = user.premium
                ? Object.entries(user.languages)
                    .filter(([_, time]) => time > 0)  // Only include languages with non-zero time
                    .map(([lang, time]) => `• ${capitalizeFirstLetter(lang)}: ${formatTime(time)}`)
                    .join('\n') || "No language data recorded."
                : "Unlock Premium to view detailed language stats.";

            // Milestone and progress bar
            const nextMilestone = getNextMilestone(user.totalCodingTime || 0);
            const progressToNextMilestone = Math.min(((user.totalCodingTime % nextMilestone.target) / nextMilestone.target) * 100, 100);
            const milestoneText = `📈 Progress: ${progressToNextMilestone.toFixed(1)}%\n\n• ${nextMilestone.name} (${formatTime(nextMilestone.target)})`;

            // Display Badges, including Premium Badge if applicable
            const badges = [...user.badges.map(b => `• ${b.emojiId || b.icon || '🏅'} ${b.name}`)].filter(Boolean).join('\n') || "No badges earned yet.";

            // Main profile embed
            const profileEmbed = new EmbedBuilder()
                .setColor('#1d5b5b')
                .setTitle(`${userDisplayName}'s Coding Profile`)
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                // .setDescription(user.bio || `Your Coding Stats!`)
                .setTimestamp()
                .addFields(
                    { name: "🕒 Total Coding Time", value: totalCodingTime, inline: true },
                    { name: "⏱️ Last Session", value: lastSession, inline: true },
                    { name: '\u200B', value: '\u200B', inline: false },
                    { name: "🔥 Current Streak", value: `${dailyCodingStreak} days`, inline: true },
                    { name: "🏆 Longest Streak", value: `${longestStreak} days`, inline: true },
                    { name: '\u200B', value: '\u200B', inline: false },
                    { name: "🎯 Next Achievement", value: milestoneText, inline: true },
                    { name: "🏆 Badges", value: badges, inline: true },
                )
                .setFooter({ text: "Use the menu to view achievements or language stats!" });

            if (user.bio) profileEmbed.setDescription(user.bio); 

            // Action row with select menu for navigation
            const row = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('profile_select')
                    .setPlaceholder('Choose what to view')
                    .addOptions([
                        {
                            label: 'Profile Overview',
                            description: 'View your main profile overview',
                            value: 'profile_overview'
                        },
                        {
                            label: 'Achievements',
                            description: 'View coding time, language, and streak achievements',
                            value: 'achievements'
                        },
                        {
                            label: 'Languages',
                            description: 'View time spent coding in each language',
                            value: 'languages'
                        }
                    ])
            );

            // Send the main profile embed
            const message = await interaction.reply({ embeds: [profileEmbed], components: [row], fetchReply: true });

            // Handle select menu interaction
            const filter = i => i.user.id === interaction.user.id;
            const collector = message.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                let selectedEmbed;

                if (i.values[0] === 'profile_overview') {
                    // Back to main profile view
                    selectedEmbed = profileEmbed;
                } else if (i.values[0] === 'achievements') {
                    // Show achievements
                    selectedEmbed = new EmbedBuilder()
                        .setColor('#1d5b5b')
                        .setTitle(`${userDisplayName}'s Achievements`)
                        .addFields(
                            { name: "🌟 Coding Time Milestones", value: timeAchievements, inline: false },
                            { name: "🗂️ Language Milestones", value: languageAchievements, inline: false },
                            { name: "🔥 Streak Achievements", value: streakAchievements, inline: false }
                        )
                        .setFooter({ text: "Use the menu to switch views!" });
                } else if (i.values[0] === 'languages') {
                    // Show language stats (premium check already applied)
                    selectedEmbed = new EmbedBuilder()
                        .setColor('#1d5b5b')
                        .setTitle(`${userDisplayName}'s Language Stats`)
                        .setDescription(languageStats)
                        .setFooter({ text: "Use the menu to switch views!" });
                }

                await i.update({ embeds: [selectedEmbed], components: [row] });
            });

            collector.on('end', () => {
                row.components.forEach(component => component.setDisabled(true));
                message.edit({ components: [row] });
            });
        } catch (error) {
            console.error("Error fetching profile:", error);
            await interaction.reply({
                content: "There was an error fetching your profile",
                ephemeral: true,
            });
        }
    }
};

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
