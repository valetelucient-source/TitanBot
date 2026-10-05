import { SlashCommandBuilder } from 'discord.js';
import { pgDb } from '../../utils/postgresDatabase.js';
import { pgConfig } from '../../config/database/postgres.js';

export default {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a player from the Atleti stats')
        .addUserOption(option =>
            option
                .setName('player')
                .setDescription('The Atleti player to remove')
                .setRequired(true)
        ),

    async execute(interaction) {
        const player = interaction.options.getUser('player');

        try {
            if (!pgDb.isAvailable()) {
                throw new Error('PostgreSQL database is not available.');
            }

            const result = await pgDb.pool.query(
                `DELETE FROM ${pgConfig.tables.atleti_stats}
                 WHERE guild_id = $1 AND user_id = $2
                 RETURNING *`,
                [interaction.guildId, player.id]
            );

            if (result.rows.length === 0) {
                return interaction.reply(
                    `❌ **${player.username}** does not have any Atleti stats recorded.`
                );
            }

            await interaction.reply(
                `🗑️ **Atleti Player Removed**\n\n` +
                `👤 Player: **${player.username}**\n\n` +
                `Their Atleti stats have been removed from the leaderboard.`
            );
        } catch (error) {
            console.error('Failed to remove Atleti player:', error);

            await interaction.reply({
                content: '❌ I could not remove that player right now.',
                ephemeral: true
            });
        }
    }
};
