import pool from './defaultClient.js';

// Возвращает список имён всех пользовательских таблиц в схеме public.
// Исключает системные схемы pg_catalog и information_schema.
export async function listTables() {
    

    const { rows } = await pool.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_type = 'BASE TABLE'
          AND table_schema NOT IN ('pg_catalog', 'information_schema')
    `);

    
    return rows.map(r => r.table_name);
}
