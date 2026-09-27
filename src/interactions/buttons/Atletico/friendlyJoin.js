export default {
    name: 'friendly_join',

    async execute(interaction) {
        await interaction.reply({
            content: `⚽ ${interaction.user} joined the friendly!`,
            ephemeral: false
        });
    }
};
