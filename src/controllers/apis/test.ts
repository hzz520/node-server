import { connectionPool } from '../../config/mysql'
import * as Flog from '../../middleware/flog/index'

export const mysql = (req, res) => {
    connectionPool.getConnection((err, connection) => {
        if (err) {
            connection.release()
            Flog.getLog('MYSQL-FAIL').err(err.message);
            res.json({ code: -1, msg: err })
        } else {
            connection.query('SELECT * FROM test', (err, result) => {
                if (err) {
                    connection.release()
                    Flog.getLog('MYSQL-FAIL').err(err.message);
                    return res.json({ code: 0, msg: err.message })
                }

                connection.release()
        
                res.json({
                    code: 0,
                    data: result
                })
            })
        }
    })
}
