// src/events/guildCreate.js
const { REST, Routes } = require("discord.js");
const fs = require("fs");
const { DISCORD_TOKEN } = require("../configs/config");

module.exports = {
    name: "guildCreate",
    async execute(guild, client) {
        // Prepare the commands
        const commands = [];
        const commandFiles = fs
            .readdirSync("./src/commands")
            .filter((file) => file.endsWith(".js"));

        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            commands.push(command.data.toJSON());
        }

        // Initialize REST client
        const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

        try {
            console.log(
                `Started refreshing application (/) commands for guild: ${guild.id}`
            );

            // Register commands for the new guild
            await rest.put(
                Routes.applicationGuildCommands(client.user.id, guild.id),
                { body: commands }
            );

            console.log(
                `Successfully registered commands for guild: ${guild.name} (${guild.id})`
            );
        } catch (error) {
            console.error(
                `Error registering commands for guild: ${guild.name} (${guild.id})`,
                error
            );
        }
    },
};
