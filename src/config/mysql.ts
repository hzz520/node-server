import mysql from 'mysql'
import Flog from '../middleware/flog/index'

export const connectionPool = mysql.createPool({
    host: 'hzz.letin2586.com',
    user: 'root',
    password: '1h2z3z2325076',
    database: 'demo'
})

