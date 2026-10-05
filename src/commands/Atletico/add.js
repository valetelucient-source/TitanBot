import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { addPlayerStats } from '../../services/atletiStatsService.js';

export default {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Add stats to an Atleti player')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option
                .setName('player')
                .setDescription('The Atleti player')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('friendly_goals')
                .setDescription('Friendly goals to add')
                .setMinValue(0)
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('league_goals')
                .setDescription('League goals to add')
                .setMinValue(0)
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('assists')
                .setDescription('Assists to add')
                .setMinValue(0)
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('clean_sheets')
                .setDescription('Clean sheets to add')
                .setMinValue(0)
                .setRequired(true)
        ),

    async execute(interaction) {
        const player = interaction.options.getUser('player');
        const friendlyGoals = interaction.options.getInteger('friendly_goals');
        const leagueGoals = interaction.options.getInteger('league_goals');
        const assists = interaction.options.getInteger('assists');
        const cleanSheets = interaction.options.getInteger('clean_sheets');

        try {
            const stats = await addPlayerStats({
                guildId: interaction.guildId,
                userId: player.id,
                friendlyGoals,
                leagueGoals,
                assists,
                cleanSheets
            });

            await interaction.reply(
                `📊 **Atleti Stats Updated**\n\n` +
                `👤 Player: **${player.username}**\n\n` +
                `🏟️ Friendly Goals: **+${friendlyGoals}**\n` +
                `⚽ League Goals: **+${leagueGoals}**\n` +
                `🅰️ Assists: **+${assists}**\n` +
                `🧤 Clean Sheets: **+${cleanSheets}**\n\n` +
                `**Current Totals**\n` +
                `🏟️ Friendly Goals: **${stats.friendly_goals}**\n` +
                `⚽ League Goals: **${stats.league_goals}**\n` +
                `🅰️ Assists: **${stats.assists}**\n` +
                `🧤 Clean Sheets: **${stats.clean_sheets}**`
            );
        } catch (error) {
            console.error('Failed to add Atleti stats:', error);

            await interaction.reply({
                content: '❌ I could not add those stats right now.',
                ephemeral: true
            });
        }
    }
};
