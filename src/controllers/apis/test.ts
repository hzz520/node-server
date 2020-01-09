import {
    PoolConnection,
    MysqlError
} from 'mysql'

import {
    Request,
    Response,
    NextFunction
} from 'express' 

import { connectionPool } from '../../config/mysql'
import Flog from '../../middleware/flog/index'

export const mysql = (req: Request, res: Response) => {
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

                setTimeout(() => {
                    console.log(result.a.c)
                    setTimeout(() => {
                        console.log(result.a.c)
                    }, 500)
                }, 500)
        
                res.json({
                    code: 0,
                    data: result
                })
            })
        }
    })
}

export const insert = (req: Request, res: Response) => {
    connectionPool.getConnection(async (err, connection) => {
        if (err) {
            connection.release()
            Flog.getLog('MYSQL-FAIL').err(err.message);
            res.json({ code: -1, msg: err })
        } else {
            let {
                title,
                author
            } = req.method === 'GET' ? req.query : req.body

            if (!title || !author) {
                connection.release()
                return res.json({
                    code: -1,
                    msg: '字段缺失'
                })
            }
            let reg = new RegExp(/<script>(.*)<\/script>/, 'g')
            if (reg.test(title) || reg.test(author)) {
                connection.release()
                return res.json({
                    code: -1,
                    msg: '非法提交'
                })
            }
            connection.query({
                sql: 'insert into test set ? ',
                values: {
                    title,
                    author,
                    submission_date: new Date()
                }
            }, (err, result) => {
                if (err) {
                    connection.release()
                    Flog.getLog('MYSQL-FAIL').err(err.message);
                    return res.json({ code: 0, msg: err.message })
                }

                connection.release()
        
                res.json({
                    code: 0,
                    msg: '数据插入成功'
                })
            })
        }
    })
}

