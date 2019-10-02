import { 
    dirname, 
    basename, 
    join, 
    extname
} from 'path'
import { sync } from 'glob'

const isDev = process.env.NODE_ENV === 'development'

class Fcdn {
    static outPath (pathname:string) {
        let dir = dirname(join(isDev ? '/Aliyun' :'/opt/', pathname.replace('/static', '')))
        let filename = basename(pathname)
        let ext = extname(pathname)
        let base = filename.replace(ext, '')
        let paths = sync('*' + ext, { cwd: dir })
        let reg = new RegExp(`^${base}-[0-9a-zA-Z]{1,}${ext}$`)
  
        return dirname(pathname) + '/' + paths.find(key => reg.test(key))
    }
}

declare module "express-serve-static-core" {
    interface Request {
        fcdn: typeof Fcdn
    }
}

export default (req, res, next) => {
    req.fcdn = Fcdn
    next()
}
