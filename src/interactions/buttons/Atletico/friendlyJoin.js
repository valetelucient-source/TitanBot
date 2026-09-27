import {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('friendly')
        .setDescription('Create an Atleti friendly'),

    async execute(interaction) {
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
            .setFooter({ text: 'Atleti Manager' });

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

        const message = await interaction.reply({
            embeds: [embed],
            components: [row],
            fetchReply: true
        });

        // Close signup after 5 minutes
        setTimeout(async () => {
            try {
                const closedEmbed = new EmbedBuilder()
                    .setTitle('🔒 ATLETI FRIENDLY')
                    .setDescription(
                        'Signup is now **closed!**\n\n' +
                        '👥 Players who joined are listed below.\n\n' +
                        '🔒 Friendly signup closed'
                    )
                    .setColor(0x1e3a8a)
                    .setFooter({ text: 'Atleti Manager' });

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
                console.error('Failed to close friendly:', error);
            }
        }, 5 * 60 * 1000);
    }
};
