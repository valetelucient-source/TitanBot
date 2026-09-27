const friendlyPlayers = new Map();

export default {
    name: 'friendly_join',

    async execute(interaction) {
        const messageId = interaction.message.id;

        if (!friendlyPlayers.has(messageId)) {
            friendlyPlayers.set(messageId, []);
        }

        const players = friendlyPlayers.get(messageId);

        // Check if already joined
        if (players.includes(interaction.user.id)) {
            await interaction.reply({
                content: '⚠️ You are already in this friendly!',
                ephemeral: true
            });
            return;
        }

        // Check 10-player limit
        if (players.length >= 10) {
            await interaction.reply({
                content: '⚠️ This friendly is full! (10/10)',
                ephemeral: true
            });
            return;
        }

        // Add player
        players.push(interaction.user.id);

        const playerList = players
            .map((id, index) => `${index + 1}. <@${id}>`)
            .join('\n');

        const embed = interaction.message.embeds[0];

        const updatedEmbed = {
            ...embed.toJSON(),
            description:
                'A friendly is being organized!\n\n' +
                `👥 Players: **${players.length}/10**\n\n` +
                `${playerList}\n\n` +
                '⏱️ Signup closes automatically in 5 minutes.'
        };

        // Update the friendly message
        await interaction.update({
            embeds: [updatedEmbed],
            components: interaction.message.components
        });

        // DM the player
        try {
            await interaction.user.send({
                content:
                    '⚽ **ATLETI FRIENDLY**\n\n' +
                    `You joined an Atleti friendly with **${players.length} player(s)** signed up.\n\n` +
                    'Keep an eye on the friendly channel for the final details!'
            });
        } catch (error) {
            // DMs are closed, so we don't stop the friendly
            console.log(`Could not DM ${interaction.user.tag}`);
        }
    }
};
