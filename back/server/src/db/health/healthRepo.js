import catalogPool from '../common/defaultClient.js'
import reportsPool from '../reports/reportsClient.js'
import userPool from '../auth/authClient.js'
import getLogger from "../../utils/logger.js";

const moduleName = "serverRepo"

export async function catalogDbHealth(){
    const sql = 'SELECT 1'

    const result = await catalogPool.query(sql)
    return result.rows ? 'ok' : 'error'

}

export async function reportsDbHealth(){
    const sql = 'SELECT 1'

    const result = await reportsPool.query(sql)
    return result.rows ? 'ok' : 'error'
}

export async function usersDbHealth(){
    const sql = 'SELECT 1'

    const result = await userPool.query(sql)

    return result.rows ? 'ok' : 'error'

}