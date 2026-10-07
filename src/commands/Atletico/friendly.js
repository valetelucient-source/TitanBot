```js
import {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
} from 'discord.js';

import {
    createFriendly,
    closeFriendly
} from '../../services/friendlyService.js';

import { isBotOwner } from '../../config/bot.js';

export default {
    data: new SlashCommandBuilder()
        .setName('friendly')
        .setDescription('Create an Atleti friendly')
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator.toString()
        ),

    category: 'Atletico',

    async execute(interaction) {
        try {
            // Only the bot owner or Discord administrators can create friendlies.
            const isOwner = isBotOwner(interaction.user.id);
            const isAdmin = interaction.member?.permissions?.has(
                PermissionFlagsBits.Administrator
            );

            if (!isOwner && !isAdmin) {
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({
                        content: '❌ You do not have permission to create a friendly.',
                        ephemeral: true
                    });
                }

                return;
            }

            const expiresAt = Math.floor(Date.now() / 1000) + 300;

            const embed = new EmbedBuilder()
                .setTitle('⚽ ATLETI FRIENDLY')
                .setDescription(
                    'A friendly is being organized!\n\n' +
                    '👥 Players: **0/10**\n\n' +
                    'No players have joined yet.\n\n' +
                    `⏱️ Signup closes <t:${expiresAt}:R>`
                )
                .setColor(0x1e3a8a)
                .setFooter({
                    text: 'Atleti Manager'
                });

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('friendly_join')
                        .setLabel('Join Friendly')
                        .setEmoji('⚽')
                        .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                        .setCustomId('friendly_leave')
                        .setLabel('Leave Friendly')
                        .setEmoji('❌')
                        .setStyle(ButtonStyle.Danger)
                );

            // Respond to Discord immediately.
            const message = await interaction.reply({
                embeds: [embed],
                components: [row],
                fetchReply: true
            });

            // Store the friendly.
            createFriendly(message.id, message);

            // Close signup after 5 minutes.
            setTimeout(async () => {
                try {
                    const friendlyClosed = closeFriendly(message.id);

                    if (friendlyClosed === false) {
                        return;
                    }

                    const closedEmbed = new EmbedBuilder()
                        .setTitle('🔒 ATLETI FRIENDLY')
                        .setDescription(
                            'Signup is now **closed!**\n\n' +
                            '👥 Players who joined are listed below.\n\n' +
                            '🔒 Friendly signup closed'
                        )
                        .setColor(0x1e3a8a)
                        .setFooter({
                            text: 'Atleti Manager'
                        });

                    const disabledRow = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('friendly_join')
                                .setLabel('Join Friendly')
                                .setEmoji('⚽')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(true),

                            new ButtonBuilder()
                                .setCustomId('friendly_leave')
                                .setLabel('Leave Friendly')
                                .setEmoji('❌')
                                .setStyle(ButtonStyle.Danger)
                                .setDisabled(true)
                        );

                    await message.edit({
                        embeds: [closedEmbed],
                        components: [disabledRow]
                    });
                } catch (error) {
                    console.error(
                        '[FRIENDLY] Failed to close friendly:',
                        error
                    );
                }
            }, 5 * 60 * 1000);

        } catch (error) {
            console.error(
                '[FRIENDLY] Failed to create friendly:',
                error
            );

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '❌ I could not create the friendly. Please try again.',
                    ephemeral: true
                }).catch(() => {});
            }
        }
    }
};
```
