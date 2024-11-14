const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('website')
        .setDescription('Display the website!')
        .addStringOption(option =>
            option.setName('section')
                .setDescription('Select a section you want to visit')
                .setRequired(false)
                .addChoices(
                    { name: 'Showcase', value: 'https://distrack-website.vercel.app/showcase' },
                    { name: 'Contact', value: 'https://distrack-website.vercel.app/contact' },
                    { name: 'Download', value: 'https://distrack-website.vercel.app/temp' },
                    { name: 'Source-Code', value: 'github'}
                )
        ),

    async execute(interaction) {
        try {
            const targetUser = interaction.user;
            const botAvatar = interaction.client.user.avatarURL({ size: 1024, dynamic: true }); // Fetches the bot's avatar in high resolution

            let section;
            const embed = new EmbedBuilder()
                .setTitle('Dis.Track Website')
                .setDescription(`Hey <@${targetUser.id}>!\nCheck out the website for more information`)
                .setThumbnail(botAvatar)
                
                .setColor(0xf1c41d)
                .setTimestamp();

            const selectedSection = interaction.options.getString('section') || 'https://distrack-website.vercel.app';

            if (selectedSection === "https://distrack-website.vercel.app/showcase") {
                section = "Showcase";
                embed.addFields({ name: section, value: selectedSection, inline: true });
                embed.setURL(selectedSection);
            } else if (selectedSection === "https://distrack-website.vercel.app/contact") {
                section = "Contact";
                embed.addFields({ name: section, value: selectedSection, inline: true });
                embed.setURL(selectedSection);
            } else if (selectedSection === "github") {
                const extension = 'https://github.com/JayNightmare/DisTrack-VSCode-Extension';
                const bot = 'https://github.com/JayNightmare/DisTrack-Discord-Bot';
                const endpoint = 'https://github.com/JayNightmare/VSCode-Endpoint-Server-Deployment';
                const website = 'https://github.com/JayNightmare/DisTrack-Website';

                embed.addFields([
                    { name: "Extension", value: extension, inline: false },
                    { name: "Dis.Track Bot", value: bot, inline: false },
                    { name: "Endpoint API", value: endpoint, inline: false },
                    { name: "Website", value: website, inline: false }
                ]);
                embed.setURL('https://github.com/JayNightmare');
            } else {
                section = "Home Page";
                embed.addFields({ name: section, value: selectedSection, inline: true });
                embed.setURL(selectedSection);
            }

            return interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
        }
    }
}

