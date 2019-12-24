import {
    PoolConnection,
    MysqlError
} from 'mysql'

import { connectionPool } from '../../config/mysql'
import Flog from '../../middleware/flog/index'

export const mysql = (req, res) => {
    connectionPool.getConnection((err: MysqlError, connection: PoolConnection) => {
        if (err) {
            connection.release()
            Flog.getLog('MYSQL-FAIL').err(err.message);
            res.json({ code: -1, msg: err })
        } else {
            connection.query('SELECT * FROM test', (err: MysqlError, result) => {
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

export const ttt = (req, res) => {
    connectionPool.getConnection(async (err, connection) => {
        if (err) {
            connection.release()
            Flog.getLog('MYSQL-FAIL').err(err.message);
            res.json({ code: -1, msg: err })
        } else {
            connection.query({
                sql: 'INSERT INFO test(title,author,submission_date) VALUES(?,?,?)',
                values: ['111', 'hzz', '2019-01-08']
            }, (err, result) => {
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
