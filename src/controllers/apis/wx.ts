import { 
    Request,
    Response,
    NextFunction
} from 'express'
import sha1 from 'sha1'
import * as Flog from '../../middleware/flog/index'

export const getWxJssdk = async (req: Request, res: Response, next: NextFunction) => {
    const grant_type = 'client_credential'
    const appid = 'wx107561c879897389'
    const secret = '4ce9a2107221d416eeaf937afc20d8f1'

    try {
        let ret = await req.Axios.get('https://api.weixin.qq.com/cgi-bin/token', {
            grant_type,
            appid,
            secret
        })

        if (ret && ret.access_token) {
            let ret1 = await req.Axios.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket', {
                access_token: ret.access_token,
                type: 'jsapi'
            })

            let jsapi_ticket = ret1.ticket
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
        }
    } catch (error) {
        Flog.getLog('ERROR').err(error)
    }
}