import { SlashCommandBuilder } from 'discord.js';
import { addPlayerStats } from '../../services/atletiStatsService.js';

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
        const channelName = interaction.channel?.name;

        if (channelName !== '📊︱𝙇𝙚𝙖𝙜𝙪𝙚-𝙍𝙚𝙨𝙪𝙡𝙩𝙨') {
            return interaction.reply({
                content: '❌ The `/result` command can only be used in the **📊︱𝙇𝙚𝙖𝙜𝙪𝙚-𝙍𝙚𝙨𝙪𝙡𝙩𝙨** channel.',
                ephemeral: true
            });
        }

        const player = interaction.options.getUser('player');
        const goals = interaction.options.getInteger('goals');
        const assists = interaction.options.getInteger('assists');
        const cleanSheets = interaction.options.getInteger('clean_sheets');

        try {
            const stats = await addPlayerStats({
                guildId: interaction.guildId,
                userId: player.id,
                leagueGoals: goals,
                assists,
                cleanSheets
            });

            await interaction.reply(
                `🏆 **Atleti League Result**\n\n` +
                `👤 Player: **${player.username}**\n` +
                `⚽ League Goals: **+${goals}**\n` +
                `🅰️ Assists: **+${assists}**\n` +
                `🧤 Clean Sheets: **+${cleanSheets}**\n\n` +
                `📊 **Current Totals**\n` +
                `⚽ League Goals: **${stats.league_goals}**\n` +
                `🅰️ Assists: **${stats.assists}**\n` +
                `🧤 Clean Sheets: **${stats.clean_sheets}**`
            );
        } catch (error) {
            console.error('Failed to save Atleti league result:', error);

            await interaction.reply({
                content: '❌ I could not save the league result right now.',
                ephemeral: true
            });
        }
    }
};
