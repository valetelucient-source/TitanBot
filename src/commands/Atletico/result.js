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
                `⚽ League Goals Added: **${goals}**\n` +
                `🅰️ Assists Added: **${assists}**\n` +
                `🧤 Clean Sheets Added: **${cleanSheets}**\n\n` +
                `📊 **Total League Goals:** ${stats.league_goals}\n` +
                `📊 **Total Assists:** ${stats.assists}\n` +
                `📊 **Total Clean Sheets:** ${stats.clean_sheets}`
            );
        } catch (error) {
            console.error('Failed to save Atleti stats:', error);

            await interaction.reply({
                content: '❌ I could not save the Atleti stats right now.',
                ephemeral: true
            });
        }
    }
};
