const friendlyPlayers = new Map();

export default {
    name: 'friendly_join',

    async execute(interaction) {
        const messageId = interaction.message.id;

        if (!friendlyPlayers.has(messageId)) {
            friendlyPlayers.set(messageId, []);
        }

        const players = friendlyPlayers.get(messageId);

        // Stop the same person from joining twice
        if (players.includes(interaction.user.id)) {
            await interaction.reply({
                content: '⚠️ You are already in this friendly!',
                ephemeral: true
            });
            return;
        }

        players.push(interaction.user.id);

        const playerList = players
            .map((id, index) => `${index + 1}. <@${id}>`)
            .join('\n');

        const embed = interaction.message.embeds[0];

        const updatedEmbed = {
            ...embed.toJSON(),
            description:
                'A friendly is being organized!\n\n' +
                `👥 Players: **${players.length}**\n\n` +
                playerList
        };

        await interaction.update({
            embeds: [updatedEmbed],
            components: interaction.message.components
        });
    }
};
