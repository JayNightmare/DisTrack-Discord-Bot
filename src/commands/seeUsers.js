const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageFlags } = require('discord.js');
const User = require('../models/User'); // Make sure this path matches the location of your User model
const { formatTime } = require('../utils/formatTime');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('seeusers')
        .setDescription('Displays a list of users linked to the bot'),

    async execute(interaction) {
        try {
            // Only allow the bot owner to run this command
            if (interaction.user.id !== process.env.OWNER_ID) {
                const embed = {
                    color: 0xff0000,
                    title: 'Permission Denied',
                    description: 'You do not have permission to use this command.',
                    footer: {
                        text: 'This command is restricted to the bot owner only.'
                    }
                };
                return interaction.reply({ embeds: [embed] });
            }

            // Fetch all users from the database
            const users = await User.find();

            // Check if there are any users stored
            if (!users || users.length === 0) {
                const embed = {
                    color: 0xff0000,
                    title: 'No Users Found',
                    description: 'No users are currently linked to the bot.',
                    footer: {
                        text: 'Use the link command to add users.'
                    }
                };
                return interaction.reply({ embeds: [embed] });
            }

            // Pagination logic
            const usersPerPage = 10;
            const totalPages = Math.ceil(users.length / usersPerPage);
            let currentPage = 1;

            const generateEmbed = (page) => {
                const startIndex = (page - 1) * usersPerPage;
                const endIndex = startIndex + usersPerPage;
                const fields = users.slice(startIndex, endIndex).map(user => ({
                    name: `${user.username}`,
                    value: `User: <@${user.userId}>\n**User ID:** ${user.userId}\n**Database ID:** ${user.id}\n**Total Coding Time:** ${formatTime(user.totalCodingTime || 0)}`,
                    inline: true
                }));

                return {
                    color: 0x27371d,
                    title: 'Linked Users',
                    fields: fields,
                    footer: {
                        text: `Page ${page} of ${totalPages} | Total users: ${users.length}`
                    }
                };
            };

            if (totalPages > 1) {
                const initialEmbed = generateEmbed(currentPage);
                await interaction.reply({ embeds: [initialEmbed] });
                const message = await interaction.fetchReply();
                await message.react('⬅️');
                await message.react('➡️');

                const filter = (reaction, user) => {
                    return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === interaction.user.id;
                };

                const collector = message.createReactionCollector({ filter, time: 60000 });

                collector.on('collect', (reaction) => {
                    if (reaction.emoji.name === '⬅️' && currentPage > 1) {
                        currentPage--;
                    } else if (reaction.emoji.name === '➡️' && currentPage < totalPages) {
                        currentPage++;
                    }

                    message.edit({ embeds: [generateEmbed(currentPage)] });
                    reaction.users.remove(interaction.user.id);
                });

                collector.on('end', () => {
                    message.reactions.removeAll().catch(console.error);
                });
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            await interaction.reply({ content: 'There was an error retrieving the user list', flags: MessageFlags.Ephemeral });
        }
    }
};
