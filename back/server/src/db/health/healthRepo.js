import catalogPool from '../common/defaultClient.js'
import userPool from '../auth/authClient.js'

export async function catalogDbHealth(){
    const sql = 'SELECT 1'

    const result = await catalogPool.query(sql)
    return result.rows ? 'ok' : 'error'

}


export async function usersDbHealth(){
    const sql = 'SELECT 1'

    const result = await userPool.query(sql)

    return result.rows ? 'ok' : 'error'

}