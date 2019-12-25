import mysql from 'mysql'

export const connectionPool = mysql.createPool({
    host: 'hzz520.site',
    user: 'root',
    password: '1h2z3z2325076',
    database: 'demo'
})

