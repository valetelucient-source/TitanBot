import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} from 'discord.js';

import { pgDb } from '../../utils/postgresDatabase.js';
import { pgConfig } from '../../config/database/postgres.js';

export default {
    data: new SlashCommandBuilder()
        .setName('strike')
        .setDescription('Give an Atleti player a strike')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option
                .setName('player')
                .setDescription('The player receiving the strike')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Reason for the strike')
                .setRequired(true)
        ),

    async execute(interaction) {
        const player = interaction.options.getUser('player');
        const reason = interaction.options.getString('reason');

        try {
            if (!pgDb.isAvailable()) {
                throw new Error('PostgreSQL database is not available.');
            }

            await pgDb.pool.query(
                `INSERT INTO ${pgConfig.tables.guilds} (id)
                 VALUES ($1)
                 ON CONFLICT (id) DO NOTHING`,
                [interaction.guildId]
            );

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

            if (!config.atletiStrikes) {
                config.atletiStrikes = {};
            }

            if (!Array.isArray(config.atletiStrikes[player.id])) {
                config.atletiStrikes[player.id] = [];
            }

            config.atletiStrikes[player.id].push({
                reason,
                issuedBy: interaction.user.id,
                issuedAt: new Date().toISOString()
            });

            await pgDb.pool.query(
                `UPDATE ${pgConfig.tables.guilds}
                 SET config = $1,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE id = $2`,
                [JSON.stringify(config), interaction.guildId]
            );

            const strikeCount = config.atletiStrikes[player.id].length;

            await interaction.reply(
                `⚠️ **ATLETI STRIKE ISSUED**\n\n` +
                `👤 Player: **${player.username}**\n` +
                `⚠️ Strikes: **${strikeCount}**\n` +
                `📝 Reason: **${reason}**\n\n` +
                `👮 Issued by: **${interaction.user.username}**`
            );

            // Find the logs channel
            const logsChannel = interaction.guild.channels.cache.find(
                channel => channel.name === 'logs'
            );

            if (logsChannel && logsChannel.isTextBased()) {
                const logEmbed = new EmbedBuilder()
                    .setTitle('⚠️ PLAYER STRIKED!')
                    .setDescription(
                        `👤 **Player:** <@${player.id}>\n` +
                        `⚠️ **Strike:** #${strikeCount}\n` +
                        `📝 **Reason:** ${reason}\n` +
                        `👮 **Admin:** <@${interaction.user.id}>`
                    )
                    .setColor(0xff0000)
                    .setTimestamp()
                    .setFooter({
                        text: 'Atleti Manager • Strike Logs'
                    });

                await logsChannel.send({
                    embeds: [logEmbed]
                });
            }

        } catch (error) {
            console.error('Failed to issue Atleti strike:', error);

            if (interaction.replied || interaction.deferred) {
                return;
            }

            await interaction.reply({
                content: '❌ I could not issue that strike right now.',
                ephemeral: true
            });
        }
    }
};
