import * as tableService from '../services/Common/tableService.js';
import getLogger from "../utils/logger.js";

const moduleName = 'tableController';
// GET /tables
// Возвращает список имён всех таблиц в БД: { data: ['table1', 'table2', ...] }
export async function list(req, res) {

    const log = getLogger(moduleName).child({
        function: 'list tables'
    })

    log.debug('list tables')

    const tables = await tableService.listTables();
    return res.status(200).json({ data: tables });

}
