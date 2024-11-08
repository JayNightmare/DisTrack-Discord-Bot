// src/utils/sendEmbed.js
const { EmbedBuilder } = require("discord.js");

function sendEmbed(channel, title, description) {
    const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle(title)
        .setDescription(description)
        .setTimestamp();

    channel.reply({ embeds: [embed] });
}

module.exports = { sendEmbed };
