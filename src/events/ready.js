// src/events/ready.js
const { Client, PermissionsBitField, SlashCommandBuilder, ChannelType, GatewayIntentBits, REST, Routes, Events, ActivityType } = require('discord.js');
const { DISCORD_TOKEN } = require('../configs/config');
const fs = require('fs');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Logged in as ${client.user.tag}`);

        client.user.setActivity('Tracking Times', { type: ActivityType.Watching });
        client.user.setStatus('dnd');

        const commands = [];
        const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            commands.push(command.data.toJSON());
        }

        const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

        try {
            console.log('Started refreshing application (/) commands');

            const guilds = await client.guilds.fetch();

            for (const guild of guilds.values()) {
                try {
                    await rest.put(
                        Routes.applicationGuildCommands(client.user.id, guild.id),
                        { body: commands }
                    );
                    console.log(`Successfully registered commands for guild: ${guild.id}`);
                } catch (error) {
                    console.error(`Error registering commands for guild: ${guild.id}`, error);
                }
            }

            console.log('Successfully reloaded application (/) commands');
        } catch (error) {
            console.error(error);
        }
    },
};
