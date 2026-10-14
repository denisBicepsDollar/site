import pool from './defaultClient.js';

const schema = 'users';

export async function findUserByUsername(username) {
    const sql = `
        SELECT *
        FROM ${schema}.users
        WHERE username = $1
    `;

    const result = await pool.query(sql, [username]);

    return result.rows[0] ?? null;
} 