import {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits
} from 'discord.js';

import { pgDb } from '../../utils/postgresDatabase.js';
import { pgConfig } from '../../config/database/postgres.js';

export default {
    data: new SlashCommandBuilder()
        .setName('signing')
        .setDescription('Add a player to the Atleti signings list')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option
                .setName('player')
                .setDescription('The player being signed')
                .setRequired(true)
        ),

    async execute(interaction) {
        const player = interaction.options.getUser('player');

        try {
            if (!pgDb.isAvailable()) {
                throw new Error('PostgreSQL database is not available.');
            }

            // Make sure the server exists
            await pgDb.pool.query(
                `INSERT INTO ${pgConfig.tables.guilds} (id)
                 VALUES ($1)
                 ON CONFLICT (id) DO NOTHING`,
                [interaction.guildId]
            );

            // Get current guild config
            const result = await pgDb.pool.query(
                `SELECT config
                 FROM ${pgConfig.tables.guilds}
                 WHERE id = $1`,
                [interaction.guildId]
            );

            let config = result.rows[0]?.config || {};

            if (typeof config === 'string') {
                try {
                    config = JSON.parse(config);
                } catch {
                    config = {};
                }
            }

            if (!Array.isArray(config.atletiSignings)) {
                config.atletiSignings = [];
            }

            // Prevent duplicate signings
            if (config.atletiSignings.includes(player.id)) {
                return interaction.reply({
                    content: `❌ **${player.username}** is already on the Atleti signing list.`,
                    ephemeral: true
                });
            }

            // Add player
            config.atletiSignings.push(player.id);

            // Save list
            await pgDb.pool.query(
                `UPDATE ${pgConfig.tables.guilds}
                 SET config = $1,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE id = $2`,
                [JSON.stringify(config), interaction.guildId]
            );

            // Build vertical signing list
            const signingList = config.atletiSignings
                .map((userId, index) => `**${index + 1}.** <@${userId}>`)
                .join('\n');

            const embed = new EmbedBuilder()
                .setTitle('🔵 ATLETI SIGNINGS')
                .setDescription(
                    `**Welcome to Lucient's Aletico!**\n\n` +
                    `${signingList}`
                )
                .setColor(0x1e3a8a)
                .setFooter({
                    text: `Atleti Manager • ${config.atletiSignings.length} Signings`
                });

            await interaction.reply({
                embeds: [embed]
            });

        } catch (error) {
            console.error('Failed to add Atleti signing:', error);

            await interaction.reply({
                content: '❌ I could not add that signing right now.',
                ephemeral: true
            });
        }
    }
};
