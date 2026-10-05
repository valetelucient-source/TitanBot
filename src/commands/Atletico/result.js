import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('result')
        .setDescription('Record an Atleti league result')
        .addUserOption(option =>
            option
                .setName('player')
                .setDescription('The Atleti player')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('goals')
                .setDescription('League goals scored')
                .setMinValue(0)
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('assists')
                .setDescription('Assists made')
                .setMinValue(0)
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('clean_sheets')
                .setDescription('Clean sheets')
                .setMinValue(0)
                .setRequired(true)
        ),

    async execute(interaction) {
        const player = interaction.options.getUser('player');
        const goals = interaction.options.getInteger('goals');
        const assists = interaction.options.getInteger('assists');
        const cleanSheets = interaction.options.getInteger('clean_sheets');

        await interaction.reply(
            `🏆 **Atleti League Result**\n\n` +
            `👤 Player: **${player.username}**\n` +
            `⚽ League Goals: **${goals}**\n` +
            `🅰️ Assists: **${assists}**\n` +
            `🧤 Clean Sheets: **${cleanSheets}**`
        );
    }
};
