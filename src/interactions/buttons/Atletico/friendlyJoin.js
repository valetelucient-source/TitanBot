import {
    EmbedBuilder
} from 'discord.js';

import {
    getFriendly,
    addPlayer,
    getPlayers
} from '../../../services/friendlyService.js';

export default {
    name: 'friendly_join',

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

        const playersBefore = getPlayers(messageId);

        // Already joined
        if (playersBefore.includes(interaction.user.id)) {
            await interaction.reply({
                content: '⚠️ You are already in this friendly!',
                ephemeral: true
            });
            return;
        }

        // Full
        if (playersBefore.length >= 10) {
            await interaction.reply({
                content: '⚠️ This friendly is full! (10/10)',
                ephemeral: true
            });
            return;
        }

        // Add player
        addPlayer(messageId, interaction.user.id);

        const players = getPlayers(messageId);

        const playerList = players
            .map((id, index) => `${index + 1}. <@${id}>`)
            .join('\n');

        const embed = EmbedBuilder.from(interaction.message.embeds[0])
            .setDescription(
                'A friendly is being organized!\n\n' +
                `👥 Players: **${players.length}/10**\n\n` +
                `${playerList}\n\n` +
                '⏱️ Signup closes automatically in 5 minutes.'
            );

        await interaction.update({
            embeds: [embed],
            components: interaction.message.components
        });

        // DM the player
        try {
            await interaction.user.send({
                content:
                    '⚽ **ATLETI FRIENDLY**\n\n' +
                    'You joined the Atleti friendly! ⚽\n\n' +
                    `👥 Players currently signed up: **${players.length}/10**\n\n` +
                    'Keep an eye on the friendly channel for the final details!'
            });
        } catch (error) {
            console.log(`Could not DM ${interaction.user.tag}`);
        }
    }
};
