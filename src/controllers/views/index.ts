import { 
    Router
} from 'express'

export default (view, reg = '/') => {
    const router = Router()

    router.get(reg, (req, res, next) => {
        res.render(view, {
            fcdn: req.fcdn
        })
    })
    return router
}