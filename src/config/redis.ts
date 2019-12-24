import * as redis from 'redis'
import * as Flog from '../middleware/flog/index'

const client = redis.createClient({
    host: 'hzz.letin2586.com',
    port: 6379,
    password: '1h2z3z2325076'
})

client.on('ready', () => {
    Flog.getLog('RREDIS').debug('redis connection success')
})

client.on('error', () => {
    Flog.getLog('RREDIS').debug('redis connection fail')
})

export default client
