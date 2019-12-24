import {
    PoolConnection,
    MysqlError
} from 'mysql'
import Flog from '../middleware/flog/index'

export default () => (err: MysqlError, connection: PoolConnection) => {
    return new Promise((resolve, reject) => {
        if (err) {
            connection.release()
            Flog.getLog('MYSQL-FAIL').err(err.message);
            resolve(err)
        } else {
            
        }
    })
}