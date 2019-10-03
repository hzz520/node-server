import axios from 'axios'
import {
    stringify,
    ParsedUrlQueryInput
} from 'querystring'
import * as Flog from '../middleware/flog/index'

declare module "express-serve-static-core" {
    interface Request {
        Axios: typeof Axios
    }
}

export class Axios {
    static defaultConfig = {
        headers: {
            'content-type': 'application/json;charset=utf-8'
        }
    }
    static get (url: string, data: ParsedUrlQueryInput = {}, config: object = {}): Promise<any> {
        let strArr = url.split('?')
        let str = strArr[1] + stringify(data)
        url = strArr[0] + '?' + str
        return axios.get(url, { ...this.defaultConfig, ...config })
            .then(res => res.data)
            .catch(err => {
                this.handleError(err)
                return err
            })
    }
    static post (url: string, data?: object, config?: object): Promise<any> {
        return axios.post(url, data, { ...this.defaultConfig, ...config })
            .then(res => res.data)
            .catch(err => {
                this.handleError(err);
                return err
            })
    }
    static handleError (err) {
        Flog.getLog('ERROR').err(err)
    }
    static express () {
        return (req, res, next) => {
            req.Axios = Axios
            next()
        }
    }
}
