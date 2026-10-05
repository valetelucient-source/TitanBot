import postgresDatabase from '../utils/postgresDatabase.js';

export async function addPlayerStats({
    guildId,
    userId,
    friendlyGoals = 0,
    leagueGoals = 0,
    assists = 0,
    cleanSheets = 0
}) {
    const query = `
        INSERT INTO atleti_stats (
            guild_id,
            user_id,
            friendly_goals,
            league_goals,
            assists,
            clean_sheets
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (guild_id, user_id)
        DO UPDATE SET
            friendly_goals = atleti_stats.friendly_goals + EXCLUDED.friendly_goals,
            league_goals = atleti_stats.league_goals + EXCLUDED.league_goals,
            assists = atleti_stats.assists + EXCLUDED.assists,
            clean_sheets = atleti_stats.clean_sheets + EXCLUDED.clean_sheets,
            updated_at = CURRENT_TIMESTAMP
        RETURNING *;
    `;

    const result = await postgresDatabase.query(query, [
        guildId,
        userId,
        friendlyGoals,
        leagueGoals,
        assists,
        cleanSheets
    ]);

    return result.rows[0];
}
