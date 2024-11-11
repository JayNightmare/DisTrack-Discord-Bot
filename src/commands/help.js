// src/commands/help.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription("Provides information on bot usage, achievements, reporting bugs, and more"),
    
    async execute(interaction) {
        // Base help menu embed
        const helpEmbed = new EmbedBuilder()
            .setColor('#1d5b5b')
            .setTitle("Help Menu")
            .setDescription("Choose an option from the menu below to learn more about each topic")
            .setFooter({ text: "Use the select menu to view specific sections!" });

        // Select menu options
        const helpMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('help_select')
                .setPlaceholder('Choose a help topic')
                .addOptions([
                    { label: 'Commands', description: 'View available commands', value: 'commands' },
                    { label: 'Achievements', description: 'Learn how to achieve milestones', value: 'achievements_info' },
                    { label: 'Bug Reports', description: 'How to report a bug', value: 'bug_report' },
                    { label: 'Suggestions', description: 'How to submit a suggestion', value: 'suggestions' },
                    { label: 'Dev Team', description: 'Meet the developers', value: 'dev_team' }
                ])
        );

        // Initial message with the base help embed and menu
        const message = await interaction.reply({
            embeds: [helpEmbed],
            components: [helpMenu],
            ephemeral: true,
            fetchReply: true
        });

        // Collector for handling select menu interactions
        const filter = i => i.user.id === interaction.user.id;
        const collector = message.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            let sectionEmbed;

            // Set up different sections based on menu selection
            switch (i.values[0]) {
                case 'commands':
                    sectionEmbed = new EmbedBuilder()
                        .setColor('#1d5b5b')
                        .setTitle("Available Commands")
                        .setDescription("Here are all the available commands and their uses:")
                        .addFields(
                            { name: "/profile", value: "Displays your coding profile, achievements, and stats or view a friends!" },
                            { name: "/achievements", value: "Displays available achievements and your progress" },
                            { name: "/compare", value: "Compare your stats with another user" },
                            { name: "/leaderboard", value: "Shows the top users based on total coding time" },
                            { name: "/recent", value: "Shows your recent coding sessions" }
                        );
                    break;
                case 'achievements_info':
                    sectionEmbed = new EmbedBuilder()
                        .setColor('#1d5b5b')
                        .setTitle("Achievements")
                        .setDescription("Achievements are earned by coding consistently and reaching milestones. " +
                            "Categories include coding time, language-specific milestones, and streaks")
                        .addFields(
                            { name: "Coding Time Achievements", value: "Earned by reaching set amounts of total coding time" },
                            { name: "Language Achievements", value: "Earned by coding in specific languages for extended periods" },
                            { name: "Streak Achievements", value: "Earned by coding for consecutive days" }
                        );
                    break;
                case 'bug_report':
                    sectionEmbed = new EmbedBuilder()
                        .setColor('#1d5b5b')
                        .setTitle("Bug Reports")
                        .setDescription("Found a bug? Here’s how to report it effectively:")
                        .addFields(
                            { name: "1. Describe the Issue", value: "Explain the issue clearly, including steps to reproduce it" },
                            { name: "2. Include Error Messages", value: "If you encountered any errors, include them in your report" },
                            { name: "3. Contact Dev Team", value: "Reach out via the official support channel or DM the developer" },
                            // //
                            { name: '\u200B', value: '\u200B', inline: true }, // Another blank line
                            { name: '\u200B', value: '\u200B', inline: true }, // Another blank line
                            { name: '\u200B', value: '\u200B', inline: true }, // Another blank line
                            // //
                            { name: '\u200B', value: '\u200B', inline: true }, // Another blank line
                            { name: 'Where to Post Issue?', value: 'There are 2 ways:\n1. GitHub: https://github.com/JayNightmare/DisTrack-Discord-Bot/issues\n2. Using /bug-report', inline: true },
                            { name: '\u200B', value: '\u200B', inline: true }, // Another blank line
                        );
                    break;
                case 'suggestions':
                    sectionEmbed = new EmbedBuilder()
                        .setColor('#1d5b5b')
                        .setTitle("Suggestions")
                        .setDescription("Have an idea? We’d love to hear it! Here’s how to make a suggestion:")
                        .addFields(
                            { name: "1. Be Specific", value: "Provide details on your idea and its potential benefits" },
                            { name: "2. Be Open to Feedback", value: "Suggestions may be refined based on feasibility" },
                            { name: "3. Submit Your Suggestion", value: "Use the suggestion box or DM the developer directly" }
                        );
                    break;
                case 'dev_team':
                    sectionEmbed = new EmbedBuilder()
                        .setColor('#1d5b5b')
                        .setTitle("Development Team")
                        .setDescription("Meet the developer behind the bot:")
                        .addFields(
                            { name: "Lead Developer of Bot", value: "Currently developed and maintained by [Jay](https://discord.com/users/373097473553727488)" },
                            { name: "Lead Developer of Extension", value: "Currently developed and maintained by [Jay](https://discord.com/users/373097473553727488)"},
                            { name: "Contact", value: "Reach out for support or feedback via DM" }
                        );
                    break;
                default:
                    sectionEmbed = helpEmbed;
            }

            // Update the message with the selected section embed
            await i.update({ embeds: [sectionEmbed], components: [helpMenu] });
        });

        // Disable the select menu when the collector ends
        collector.on('end', () => {
            helpMenu.components[0].setDisabled(true);
            message.edit({ components: [helpMenu] });
        });
    }
};
