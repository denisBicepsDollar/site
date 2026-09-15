import pool from './authClient.js';

export async function findUserByUsername(username) {
    const sql = `
        SELECT *
        FROM users
        WHERE username = $1
    `;

    const result = await pool.query(sql, [username]);

    return result.rows[0] ?? null;
} 