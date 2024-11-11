const { SlashCommandBuilder } = require('@discordjs/builders');
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
                // embed message
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


            // Create a formatted string of users to display
            const userList = users.map(user =>`- Name: <@${user.userId}>\n- User ID: ${user.userId}\n- Database ID: ${user.id}\n- Total Coding Time: ${totalCodingTime = formatTime(user.totalCodingTime || 0)}`).join('\n\n');

            // Send the formatted list as an embed
            const embed = {
                color: 0x27371d,
                title: 'Linked Users',
                description: userList,
                footer: {
                    text: `Total users: ${users.length}`
                }
            };

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching users:', error);
            await interaction.reply({ content: 'There was an error retrieving the user list', ephemeral: true });
        }
    }
};
