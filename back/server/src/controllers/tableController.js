import * as tableService from '../services/Common/tableService.js';
import {ApiError} from "../utils/ApiError.js";

// GET /tables
// Возвращает список имён всех таблиц в БД: { data: ['table1', 'table2', ...] }
export async function list(req, res) {

    console.log(`[tableController] list`);

    const tables = await tableService.listTables();
    return res.status(200).json({ data: tables });

}

// POST /tables
// Создаёт новую таблицу. Ожидает тело: { params: { tableName, columns: [...] } }
// Каждая колонка: { name, type, nullable?, default? }
// Возвращает: { data: { table, sql } }
export async function create(req, res) {

    const params    = (req.body && req.body.params) || {};
    const tableName = params.tableName;
    const columns   = params.columns;
    console.log(`[tableController] create name="${tableName}"`, columns);

    if (!tableName || !Array.isArray(columns) || columns.length === 0) {
        throw new ApiError(400)
    }

    const table = await tableService.create(tableName, columns);
    return res.status(200).json({ data: table });

}

// DELETE /tables/:tableName
// Удаляет таблицу. Возвращает: { data: result }
export async function remove(req, res) {

    const { tableName } = req.params;
    console.log(`[tableController] remove name="${tableName}"`);

    const result = await tableService.remove(tableName);
    return res.status(200).json({ data: result });

}