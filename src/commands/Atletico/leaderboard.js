import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { pgDb } from '../../utils/postgresDatabase.js';
import { pgConfig } from '../../config/database/postgres.js';

export default {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Show the Atleti player leaderboard'),

    async execute(interaction) {
        try {
            if (!pgDb.isAvailable()) {
                throw new Error('PostgreSQL database is not available.');
            }

            const result = await pgDb.pool.query(`
                SELECT
                    user_id,
                    friendly_goals,
                    league_goals,
                    assists,
                    clean_sheets
                FROM ${pgConfig.tables.atleti_stats}
                WHERE guild_id = $1
                ORDER BY
                    (league_goals + FLOOR(friendly_goals / 5.0)) DESC,
                    league_goals DESC,
                    friendly_goals DESC,
                    assists DESC
                LIMIT 10
            `, [interaction.guildId]);

            if (result.rows.length === 0) {
                return interaction.reply(
                    '📊 **Atleti Leaderboard**\n\nNo player stats have been recorded yet.'
                );
            }

            const lines = result.rows.map((player, index) => {
                const friendlyGoals = Number(player.friendly_goals) || 0;
                const leagueGoals = Number(player.league_goals) || 0;
                const assists = Number(player.assists) || 0;
                const cleanSheets = Number(player.clean_sheets) || 0;

                const friendlyGoalValue = Math.floor(friendlyGoals / 5);
                const goalValue = leagueGoals + friendlyGoalValue;

                let medal = `${index + 1}.`;

                if (index === 0) medal = '🥇';
                if (index === 1) medal = '🥈';
                if (index === 2) medal = '🥉';

                return (
                    `${medal} <@${player.user_id}>\n` +
                    `🏆 **Goal Value:** ${goalValue}\n` +
                    `⚽ League Goals: **${leagueGoals}**\n` +
                    `🏟️ Friendly Goals: **${friendlyGoals}** ` +
                    `(${friendlyGoalValue} value)\n` +
                    `🅰️ Assists: **${assists}**\n` +
                    `🧤 Clean Sheets: **${cleanSheets}**`
                );
            });

            const embed = new EmbedBuilder()
                .setTitle('🏆 ATLETI LEADERBOARD')
                .setDescription(lines.join('\n\n'))
                .setColor(0x1e3a8a)
                .setFooter({
                    text: 'Atleti Manager • 5 Friendly Goals = 1 League Goal'
                });

            await interaction.reply({
                embeds: [embed]
            });
        } catch (error) {
            console.error('Failed to load Atleti leaderboard:', error);

            await interaction.reply({
                content: '❌ I could not load the Atleti leaderboard right now.',
                ephemeral: true
            });
        }
    }
};
