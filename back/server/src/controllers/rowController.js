import * as rowService from '../services/Common/rowService.js';
import {ApiError} from "../utils/ApiError.js";
import getLogger from "../utils/logger.js";


const moduleName = 'rowController';


// GET /tables/:tableName/rows и GET /tables/:tableName
// Возвращает метаданные колонок и строки таблицы: { data: { columns, data } }
export async function list(req, res) {

    const log = getLogger(moduleName).child({
        function: 'list rows'
    })

    const { tableName } = req.params;
    log.debug({tableName});

    const rows = await rowService.getRows(tableName);
    return res.status(200).json({ data: rows });
}

// GET /tables/:tableName/rows/:rowId
// Возвращает одну строку по id: { data: row }
// Если строка не найдена — 404.
export async function get(req, res) {

    const log = getLogger(moduleName).child({
        function: 'get rows'
    })

    const { tableName, rowId } = req.params;
    log.debug({tableName, rowId});

    const rows = await rowService.getRow(tableName, { where: { id: { op: '=', value: rowId } } });
    if (!rows.length)
        throw new ApiError(404)
    return res.status(200).json({ data: rows[0] });

}

// POST /tables/:tableName/rows
// Создаёт новую строку. Тело запроса — объект с полями строки.
// Возвращает созданную строку: { data: row }
export async function create(req, res) {

    const log = getLogger(moduleName).child({
        function: 'create row'
    })

    const { tableName } = req.params;
    const data = req.body;
    log.debug({tableName, data});

    const rows = await rowService.createRow(tableName, data);
    return res.status(200).json({ data: rows });

}

// PUT /tables/:tableName/rows/:filterColumn/:filterValue
// Обновляет строку по значению указанной колонки. Тело запроса — новые значения полей.
// Возвращает обновлённую строку: { data: row }
export async function replace(req, res) {
    const log = getLogger(moduleName).child({
        function: 'replace row'
    })

    const { tableName, filterColumn, filterValue } = req.params;
    const data = req.body;
    log.debug(
        { tableName, data }, `where ${filterColumn} = ${filterValue}`
    );

    const rows = await rowService.replaceRow(tableName, data, filterValue, filterColumn);
    return res.status(200).json({ data: rows });
}

// DELETE /tables/:tableName/rows/:filterColumn/:filterValue
// Удаляет строку по значению указанной колонки.
// Возвращает удалённую строку: { data: row }
export async function remove(req, res) {
    const log = getLogger(moduleName).child({
        function: 'remove row'
    })

    const { tableName, filterColumn, filterValue } = req.params;
    log.debug({tableName}, `where ${filterColumn} = ${filterValue}`);

    const rows = await rowService.removeRow(tableName, filterValue, filterColumn);
    return res.status(200).json({ data: rows });

}