import * as express from 'express'

export default (view) => {
    const router = express.Router()

    router.get('/', (req, res, next) => {
        res.render(view, {
            fcdn: req.fcdn
        })
    })
    return router
}