import Log4j from './log4js'

function getStr(msg, req, res) {
    var array = msg.split(' ')
    var tokenMap = {
        ":url": getUrls(req),
        ":protocol": req.protocol,
        ":hostname": req.hostname,
        ":method": req.method,
        ":status": res.__statusCode || res.statusCode,
        ":response-time": res.responseTime,
        ":date": new Date().toLocaleString(),
        ":referrer": req.headers.referer || req.headers.referrer || '',
        ":remote-addr": req.headers['x-forwarded-for'] || req.ip || req._remoteAddress || (req.socket && (req.socket.remoteAddress || (req.socket.socket && req.socket.socket.remoteAddress))),
        ":user-agent": req.headers['user-agent']
    }
    let retArray=[]
    array.filter((item) => {
        let replaceToken = tokenMap[item]
        if(/^:/.test(item)){
            retArray.push(replaceToken||'')
        }else{
            retArray.push(item)
        }
    });
    return retArray.join(' ');

};

function getUrls(req) {
    return req.originalUrl || req.url;
}

interface logConfig {
    isOnline: boolean
}

namespace Flog {
    export function getLog(category: string, level?: string): Log4j {
        let logger = new Log4j(category, level || this.level);
        return logger;
    }


    export function express() {
        let logger = new Log4j('SYSTEM');
        return function (req, res: any, next: Function) {
            const start = +new Date();
            res.on('finish', () => {
                res.responseTime = (+new Date() - start)+"ms";
                let str = ':method :url :status :response-time'
                const logstr = getStr(str, req, res);
                logger.log(logstr);
            })
            return next();
        }
    }
}

export = Flog
