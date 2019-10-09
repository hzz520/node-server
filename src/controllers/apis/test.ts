import { connection } from '../../config/mysql'

export const mysql = (req, res) => {
    connection.connect()
    connection.query('SELECT * FROM test', (err, result) => {
        if (err) {
            console.log('[SELECT ERROR] - ',err.message);
            return res.json({ code: 0, msg: err.message })
        }

        res.json({
            code: 0,
            data: result
        })
    }) 
    connection.end()
}
