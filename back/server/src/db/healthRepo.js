import pool from './defaultClient.js'

export async function dbHealth() {
    const sql = 'SELECT 1'

    const result = await pool.query(sql)
    return result.rows ? 'ok' : 'error'

}