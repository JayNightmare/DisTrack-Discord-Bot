const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('team')
        .setDescription("Displays information about the DisTrack team and tools used"),
    
    async execute(interaction) {
        const tools = [ "Node.js", "Discord.JS", "MongoDB", "VSCode IDE", "GitHub" ];
        const hosting = [ "Linode - Ubuntu Server" ];

        const teamMembers = [
            { name: "JayNightmare", role: "Lead Developer", github: "https://github.com/JayNightmare" },
        ];

        const toolsList = tools.map((tool, index) => `**${index + 1}.** ${tool}`).join("\n");
        const hostingList = hosting.map((host, index) => `**${index + 1}.** ${host}`).join("\n");
        const teamList = teamMembers.map(member => `**${member.name}** - *${member.role}*\n[Github Profile](${member.github})`).join('\n');

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("Dis.Track Team and Tools")
            .setDescription("Here's a list of the tools we use and the team")
            .addFields(
                { name: "Tools", value: toolsList, inline: true },
                { name: "Hosting", value: hostingList, inline: true },
                { name: "Team Members", value: teamList, inline: false }
            )
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setFooter({ text: "Thank you for using Dis.Track!" })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
}