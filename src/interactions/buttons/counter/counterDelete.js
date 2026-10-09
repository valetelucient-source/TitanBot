export default {
name: 'counter-delete',

```
async execute(interaction) {
    if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
            content: 'This counter deletion feature is currently unavailable.',
            ephemeral: true
        }).catch(() => {});
    } else {
        await interaction.reply({
            content: 'This counter deletion feature is currently unavailable.',
            ephemeral: true
        }).catch(() => {});
    }
}
```

};
