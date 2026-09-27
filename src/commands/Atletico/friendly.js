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
        const embed = new EmbedBuilder()
            .setTitle('⚽ ATLETI FRIENDLY')
            .setDescription(
                'A friendly is being organized!\n\n' +
                'Click **Join Friendly** to join the game.\n\n' +
                '👥 Players: **0**'
            )
            .setColor(0x1e3a8a)
            .setFooter({ text: 'Atleti Manager' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('friendly_join')
                    .setLabel('Join Friendly')
                    .setEmoji('⚽')
                    .setStyle(ButtonStyle.Primary)
            );

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
};
