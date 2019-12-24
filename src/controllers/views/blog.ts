import express from 'express'

const router = express.Router()

router.get('/', (req, res, next) => {
    res.render('blogs', {
        fcdn: req.fcdn
    })
})

export default router
