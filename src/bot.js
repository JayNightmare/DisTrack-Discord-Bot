// src/bot.js
const { Client, PermissionsBitField, SlashCommandBuilder, ChannelType, GatewayIntentBits, REST, Routes, Events, ActivityType, Collection } = require('discord.js');
const express = require('express');
const fs = require('fs');
const { DISCORD_TOKEN, PORT } = require('./configs/config');
const { connectToDatabase } = require('./utils/database');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
    ],
    partials: [
        'MESSAGE',
        'CHANNEL',
        'REACTION'
    ]
});

client.commands = new Collection();
const app = express();
app.use(express.json());

try {
    // Load commands
    const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.data.name, command);
    }
    
    // Load events
    const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
} catch (err) {
    console.error(err);
}


// Connect to MongoDB
connectToDatabase();

// Store session data in memory or MongoDB if needed
let userSessionData = {}; // { userId: duration }

// Endpoint to receive data from VSCode extension
app.post('/coding-session', (req, res) => {
    const { user, duration } = req.body;

    try {
        userSessionData[user] = duration; // Store duration in memory
        console.log(`Received duration ${duration} seconds for user ${user}`);
        res.status(200).json({ message: 'Data received successfully' });
    } catch (error) {
        console.error('Failed to process coding session data:', error);
        res.status(500).json({ message: 'Error processing data' });
    }
});

// Start both the bot and the Express server
client.login(DISCORD_TOKEN);
app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
});
