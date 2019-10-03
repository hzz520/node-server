import { 
    Request,
    Response,
    NextFunction
} from 'express'
import * as sha1 from 'sha1'
import * as Flog from '../../middleware/flog/index'
import * as request from 'request'

export const getWxJssdk = async (req: Request, res: Response, next: NextFunction) => {
    const grant_type = 'client_credential'
    const appid = 'wx107561c879897389'
    const secret = '4ce9a2107221d416eeaf937afc20d8f1'

    try {
        request('https://api.weixin.qq.com/cgi-bin/token?grant_type=' + grant_type + '&appid=' + appid + '&secret=' + secret, (err, response, body) => {
            if (err) {
                Flog.getLog('ERROR').err(err)
                return res.json({ code: 1, msg: err })
            }
            let access_token = JSON.parse(body).access_token
            
            request('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + access_token + '&type=jsapi', (err, response, body) => {
                if (err) {
                    Flog.getLog('ERROR').err(err)
                    return res.json({ code: 1, msg: err })
                }
                let jsapi_ticket = JSON.parse(body).ticket
                let nonce_str = '123456' 
                let timestamp = Math.floor(new Date().getTime()/1000)
                let url = req.body.url

                let str = 'jsapi_ticket=' + jsapi_ticket + '&noncestr=' + nonce_str + '&timestamp=' + timestamp + '&url=' + url
                
                let signature = sha1(str)

                res.send({
                    appId: appid,
                    timestamp:timestamp,
                    nonceStr: nonce_str,
                    signature: signature,
                })
            })
        })
    } catch (error) {
        Flog.getLog('ERROR').err(error)
    }
}