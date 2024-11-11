// src/commands/showAchievements.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const { registerUser, getUserData } = require('../services/userServices.js');
const { loadAchievements } = require('../utils/loadAchievements.js');

const ACHIEVEMENTS_PER_PAGE = 5;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('achievements')
        .setDescription("Displays available achievements and shows which ones you've earned"),
    
    async execute(interaction) {
        try {
            const targetUser = interaction.user;
            const userId = targetUser.id;
            const username = targetUser.username;
            const userDisplayName = targetUser.displayName;

            // Register user if they don't exist and retrieve user data
            let user = await registerUser(userId, username);

            // Load all achievements
            const allAchievements = await loadAchievements();

            // Introduction screen
            const introEmbed = new EmbedBuilder()
                .setColor('#2a2d2e')
                .setTitle("Available Achievement Categories")
                .setDescription(
                    "Select a category below to view achievements:\n\n" +
                    "1. **Coding Time**: Achievements based on total coding time.\n" +
                    "2. **Language**: Achievements based on time spent in specific languages.\n" +
                    "3. **Streak**: Achievements based on consecutive days of coding."
                )
                .setFooter({ text: "Use the select menu to view specific achievements!" });

            // Select menu for achievement category selection
            const selectMenu = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('achievement_category_select')
                    .setPlaceholder('Choose an achievement category')
                    .addOptions([
                        { label: 'Coding Time', description: 'View achievements based on coding time', value: 'time' },
                        { label: 'Language', description: 'View achievements based on coding languages', value: 'language' },
                        { label: 'Streak', description: 'View achievements based on coding streaks', value: 'streak' }
                    ])
            );

            // Send the initial embed with the select menu
            const message = await interaction.reply({
                embeds: [introEmbed],
                components: [selectMenu],
                fetchReply: true
            });

            // Collector for select menu interaction
            const filter = i => i.user.id === interaction.user.id;
            const collector = message.createMessageComponentCollector({ filter, time: 30000 });

            // Initialize variables for pagination and category
            let currentPage = 0;
            let achievementDisplay = [];
            let totalPages = 1;
            let category;

            // Helper function to create an embed for a specific page
            const createEmbed = (page, userDisplayName, category) => {
                const start = page * ACHIEVEMENTS_PER_PAGE;
                const end = start + ACHIEVEMENTS_PER_PAGE;
                const pageAchievements = achievementDisplay.slice(start, end).join('\n\n') || "No achievements available.";

                return new EmbedBuilder()
                    .setColor('#2a2d2e')
                    .setTitle(`${userDisplayName}'s ${capitalizeFirstLetter(category)} Achievements`)
                    .setDescription("✅ = Earned | ❌ = Not yet achieved")
                    .addFields({ name: "Achievements", value: pageAchievements })
                    .setFooter({ text: `Page ${page + 1} of ${totalPages} • Keep coding to unlock more achievements!` });
            };

            collector.on('collect', async i => {
                if (i.isStringSelectMenu()) {
                    // Handle select menu interactions
                    category = i.values[0];
                    const filteredAchievements = allAchievements.filter(a => a.category === category);

                    // Separate user achievements by name
                    const userAchievements = user.achievements.map(a => a.name);

                    // Organize achievements for display, marking earned and unearned achievements
                    achievementDisplay = filteredAchievements.map(achievement => {
                        const hasAchieved = userAchievements.includes(achievement.name);
                        return hasAchieved
                            ? `✅ **${achievement.name}**: ${achievement.description}`
                            : `❌ **${achievement.name}**: ${achievement.description}`;
                    });

                    // Update pagination info
                    totalPages = Math.ceil(achievementDisplay.length / ACHIEVEMENTS_PER_PAGE);
                    currentPage = 0;

                    // Initial embed and buttons
                    const embed = createEmbed(currentPage, userDisplayName, category);
                    const row = getPaginationButtons(currentPage, totalPages);

                    // Update message with selected achievements
                    await i.update({ embeds: [embed], components: [selectMenu, row] });
                } else if (i.isButton()) {
                    // Handle button interactions for pagination
                    if (i.customId === 'previous' && currentPage > 0) {
                        currentPage--;
                    } else if (i.customId === 'next' && currentPage < totalPages - 1) {
                        currentPage++;
                    }

                    // Update embed with new page and button states
                    await i.update({
                        embeds: [createEmbed(currentPage, userDisplayName, category)],
                        components: [selectMenu, getPaginationButtons(currentPage, totalPages)]
                    });
                }
            });

            collector.on('end', () => {
                // Disable buttons and menu after timeout
                selectMenu.components[0].setDisabled(true);
                message.edit({
                    components: [
                        selectMenu,
                        getPaginationButtons(currentPage, totalPages, true)
                    ]
                });
            });
        } catch (error) {
            console.error("Error displaying achievements:", error);
            await interaction.reply({
                content: "There was an error displaying the achievements.",
                ephemeral: true,
            });
        }
    }
};

// Helper function to create pagination buttons with an option to disable them
function getPaginationButtons(currentPage, totalPages, disable = false) {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('previous')
            .setLabel('Previous')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === 0 || disable),
        new ButtonBuilder()
            .setCustomId('next')
            .setLabel('Next')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage === totalPages - 1 || disable)
    );
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
