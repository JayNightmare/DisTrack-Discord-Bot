const { EmbedBuilder } = require("discord.js");
const { getUserData, updateUserBadges } = require('../services/userServices.js');
require('dotenv').config();

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, userSessionData) {
        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) return;

            try { await command.execute(interaction, userSessionData); }
            catch (error) {
                console.error(`Error executing ${interaction.commandName}:`, error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
        else if (interaction.isButton()) {
            const [action, userId, encodedReason] = interaction.customId.split('_');
            const { user } = interaction;
            const reason = decodeURIComponent(encodedReason);
            const invite = process.env.DEV_SERVER_INVITE;

            try {
                if (action === 'accept') {
                    const badgeName = 'Dev';
                    const badgeIcon = '<:Discord_Developer:1318976854358622230>';
                    const userData = await getUserData(user.id);
                    if (!userData.badges.some(badge => badge.name === badgeName)) await updateUserBadges(user.id, { name: badgeName, icon: badgeIcon, dateEarned: new Date() });

                    // ? To Webhook Interaction
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('🛠️ Developer Request')
                                .setColor('#5865F2')
                                .setDescription(`**User**: ${user.tag} (${user.id})\n**Reason**:\n\n${reason}\n\n**Status**: ✅ Accepted`)
                                .setTimestamp()
                        ],
                        components: []
                    });

                    // ? To User Interaction
                    await interaction.client.users.send(userId, {
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('🛠️ Developer Request')
                                .setColor('#5865F2')
                                .setDescription(`**User**: ${user.tag} (${user.id})\n**Reason**:\n\n${reason}\n\n**Status**: ✅ Accepted\n\n**Invite:** ${invite}`)
                                .setTimestamp()
                        ]});
                } else if (action === 'deny') {
                    // ? To Webhook Interaction
                    await interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('🛠️ Developer Request')
                                .setColor('#5865F2')
                                .setDescription(`**User**: ${user.tag} (${user.id})\n**Reason**:\n\n${reason}\n\n**Status**: ❌ Denied`)
                                .setTimestamp()
                        ],
                        components: []
                    });

                    // ? To User Interaction
                    await interaction.client.users.send(userId, {
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('🛠️ Developer Request')
                                .setColor('#5865F2')
                                .setDescription(`**User**: ${user.tag} (${user.id})\n**Reason**:\n\n${reason}\n\n**Status**: ❌ Denied`)
                                .setTimestamp()
                        ]});
                }
            } catch (error) {
                console.error(`Error handling button interaction:`, error);
                await interaction.reply({ content: 'There was an error processing the button action.', ephemeral: true });
            }
        }
    },
};
