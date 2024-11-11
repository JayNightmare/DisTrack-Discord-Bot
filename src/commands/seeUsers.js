const { SlashCommandBuilder } = require('@discordjs/builders');
const User = require('../models/User'); // Make sure this path matches the location of your User model
const { sendEmbed } = require('../utils/sendEmbed'); // Assuming you have a sendEmbed utility

module.exports = {
    data: new SlashCommandBuilder()
        .setName('seeusers')
        .setDescription('Displays a list of users linked to the bot'),

    async execute(interaction) {
        try {
            // Fetch all users from the database
            const users = await User.find();

            // Check if there are any users stored
            if (!users || users.length === 0) {
                return interaction.reply({ content: 'No users found in the database', ephemeral: true });
            }

            // Create a formatted string of users to display
            const userList = users.map(user => `UserID: ${user.userId}, Total Coding Time: ${user.totalCodingTime} seconds`).join('\n');

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
