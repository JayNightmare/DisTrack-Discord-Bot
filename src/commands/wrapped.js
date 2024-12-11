const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUserYearlyStats } = require('../utils/fetchData.js'); // Adjust to your file structure
const { generateStatsSummary } = require('../utils/generateFunctions.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wrapped')
        .setDescription('View your yearly coding stats!'),
    async execute(interaction) {
        const userId = interaction.user.id;

        try {
            const sessions = await getUserYearlyStats(userId);
            const statsSummary = generateStatsSummary(sessions);

            const embed = new EmbedBuilder()
                .setColor('#1DB954')
                .setTitle(`${interaction.user.username}'s 2024 Wrapped`)
                .setDescription('Here is what you accomplished this year!')
                .addFields(
                    { name: 'Total Hours', value: `${statsSummary.totalHours} hours`, inline: true },
                    { name: 'Longest Streak', value: `${statsSummary.longestStreak} days`, inline: true },
                    { name: 'Most Productive Day', value: statsSummary.mostProductiveDay, inline: true }
                )
                .setFooter({ text: 'Keep up the great work in 2025!' });

            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'Error fetching your wrapped stats. Please try again later!', ephemeral: true });
        }
    },
};
