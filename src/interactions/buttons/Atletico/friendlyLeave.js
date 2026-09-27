const friendlyPlayers = new Map();

export default {
    name: 'friendly_leave',

    async execute(interaction) {
        const messageId = interaction.message.id;

        if (!friendlyPlayers.has(messageId)) {
            friendlyPlayers.set(messageId, []);
        }

        const players = friendlyPlayers.get(messageId);

        // Check if the player is actually in the friendly
        if (!players.includes(interaction.user.id)) {
            await interaction.reply({
                content: '⚠️ You are not in this friendly!',
                ephemeral: true
            });
            return;
        }

        // Remove player
        const index = players.indexOf(interaction.user.id);
        players.splice(index, 1);

        const playerList = players.length > 0
            ? players
                .map((id, index) => `${index + 1}. <@${id}>`)
                .join('\n')
            : 'No players have joined yet.';

        const embed = interaction.message.embeds[0];

        const updatedEmbed = {
            ...embed.toJSON(),
            description:
                'A friendly is being organized!\n\n' +
                `👥 Players: **${players.length}/10**\n\n` +
                `${playerList}\n\n` +
                '⏱️ Signup closes automatically in 5 minutes.'
        };

        await interaction.update({
            embeds: [updatedEmbed],
            components: interaction.message.components
        });
    }
};
