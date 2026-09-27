import {
    EmbedBuilder
} from 'discord.js';

import {
    getFriendly,
    removePlayer,
    getPlayers
} from '../../../services/friendlyService.js';

export default {
    name: 'friendly_leave',

    async execute(interaction) {
        const messageId = interaction.message.id;
        const friendly = getFriendly(messageId);

        // Friendly doesn't exist
        if (!friendly) {
            await interaction.reply({
                content: '⚠️ This friendly is no longer available.',
                ephemeral: true
            });
            return;
        }

        // Signup is closed
        if (friendly.closed) {
            await interaction.reply({
                content: '🔒 Signup for this friendly is closed.',
                ephemeral: true
            });
            return;
        }

        const players = getPlayers(messageId);

        // Check if player is actually in the friendly
        if (!players.includes(interaction.user.id)) {
            await interaction.reply({
                content: '⚠️ You are not in this friendly!',
                ephemeral: true
            });
            return;
        }

        // Remove player
        removePlayer(messageId, interaction.user.id);

        const updatedPlayers = getPlayers(messageId);

        const playerList = updatedPlayers.length > 0
            ? updatedPlayers
                .map((id, index) => `${index + 1}. <@${id}>`)
                .join('\n')
            : 'No players have joined yet.';

        const embed = EmbedBuilder.from(interaction.message.embeds[0])
            .setDescription(
                'A friendly is being organized!\n\n' +
                `👥 Players: **${updatedPlayers.length}/10**\n\n` +
                `${playerList}\n\n` +
                '⏱️ Signup closes automatically in 5 minutes.'
            );

        await interaction.update({
            embeds: [embed],
            components: interaction.message.components
        });
    }
};
