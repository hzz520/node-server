/*
 * @Descripttion: 
 * @version: 
 * @Author: zhongzhen.hzz
 * @Date: 2020-08-11 17:20:17
 * @LastEditors: zhongzhen.hzz
 * @LastEditTime: 2020-08-11 20:30:17
 */
import { 
    Request,
    Response,
    NextFunction
} from 'express'
import sha1 from 'sha1'
import crypto from 'crypto'
import Flog from '../../middleware/flog/index'
import request from 'request'

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

export const wxmsg = async (req: Request, res: Response, next: NextFunction) => {
    let signature = req.query.signature,
       timestamp = req.query.timestamp,
       nonce = req.query.nonce,
       echostr = req.query.echostr;
      let a = crypto.createHash('sha1').update(['aiguangjia', timestamp, nonce].sort().join('')).digest('hex');  // 这里的pushToken就是在上面的那里配置的Token
 
   if(a == signature){
     // 如果验证成功则原封不动的返回
     res.send(echostr);
   }else{
     res.send({
       status: 400,
       data: "check msg error"
     })
   }
}