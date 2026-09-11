import * as tableService from '../services/Common/tableService.js';
import {ApiError} from "../utils/ApiError.js";
import logger from "../utils/logger.js";

const logModule = logger.child({
    module: 'tableController'
})
// GET /tables
// Возвращает список имён всех таблиц в БД: { data: ['table1', 'table2', ...] }
export async function list(req, res) {

    const log = logModule.child({
        function: 'list tables'
    })

    log.debug('list tables')

    const tables = await tableService.listTables();
    return res.status(200).json({ data: tables });

}

// POST /tables
// Создаёт новую таблицу. Ожидает тело: { params: { tableName, columns: [...] } }
// Каждая колонка: { name, type, nullable?, default? }
// Возвращает: { data: { table, sql } }
export async function create(req, res) {

    const log = logModule.child({
        function: 'create table'
    })

    const params    = (req.body && req.body.params) || {};
    const tableName = params.tableName;
    const columns   = params.columns;
    log.debug({tableName, columns});

    if (!tableName || !Array.isArray(columns) || columns.length === 0) {
        throw new ApiError(400)
    }

    const table = await tableService.create(tableName, columns);
    return res.status(200).json({ data: table });

}

// DELETE /tables/:tableName
// Удаляет таблицу. Возвращает: { data: result }
export async function remove(req, res) {

    const log = logModule.child({
        function: 'delete table'
    })
    const { tableName } = req.params;
    log.debug({tableName});

    const result = await tableService.remove(tableName);
    return res.status(200).json({ data: result });

}