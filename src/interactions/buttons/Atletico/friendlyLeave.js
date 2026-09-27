export default {
    name: 'friendly_leave',

    async execute(interaction) {
        await interaction.reply({
            content: '❌ Leave Friendly is being set up!',
            ephemeral: true
        });
    }
};
