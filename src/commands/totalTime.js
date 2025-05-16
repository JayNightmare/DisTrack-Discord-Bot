const { EmbedBuilder, SlashCommandBuilder, MessageFlags } = require('discord.js');
const fetcher = require('../utils/fetchData.js');
const { formatTime } = require('../utils/formatTime.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('total-time')
        .setDescription('Get the total time of all users in the database'),
    
    async execute(interaction) {
        try {
            const users = await fetcher.getAllUsers();
            if (!users || users.length === 0) {
                return interaction.reply('No user data found in the database.');
            }

            const totalTime = users.reduce((sum, user) => sum + (user.totalCodingTime || 0), 0);
            if (totalTime === 0) {
                return interaction.reply('No coding time recorded for any user');
            }

            const highestUser = users.reduce((max, user) =>
                (user.totalCodingTime || 0) > (max.totalCodingTime || 0) ? user : max, {});

            const highestStreakUser = users.reduce((max, user) => {
                const userLongestStreak = user.longestStreak || 0;
                const userCurrentStreak = user.currentStreak || 0;
                const maxLongestStreak = max.longestStreak || 0;
                const maxCurrentStreak = max.currentStreak || 0;

                if (
                    userLongestStreak > maxLongestStreak ||
                    (userLongestStreak === maxLongestStreak && userCurrentStreak > maxCurrentStreak)
                ) {
                    return user;
                }
                return max;
            }, {});

            const days = Math.floor(highestUser.totalCodingTime / (24 * 3600));

            const embed = new EmbedBuilder()
                .setColor('#579920')
                .setTitle('Total Time')
                .setDescription('The combined time of all users in the database')
                .addFields(
                    { name: 'Total Time', value: `⌛ ${formatTime(totalTime)}`, inline: false },
                    { name: `\u200b`, value: `\u200b`, inline: false },
                    { name: 'Total Users', value: `👤 ${users.length} users`, inline: true },
                    { name: 'Top User', value: `👤 ${highestUser.username || 'Unknown'}
                        ⌛ Time: ${days > 0 ? `${days} days` : '0 days'}`,
                        inline: true },
                    { name: 'Highest Streak', value: `👤 ${highestStreakUser.username || 'Unknown'}
                        🚀 Longest: ${highestStreakUser.longestStreak || 0} days
                        📆 Current: ${highestStreakUser.currentStreak || 0} days`,
                        inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching total time:', error);
            interaction.reply({ content: 'An error occurred while fetching the total time', flags: MessageFlags.Ephemeral });
        }
    },
};