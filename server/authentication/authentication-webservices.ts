import express from "express";

const router = express.Router()

const userId = '1'
const login = 'test'
const password = 'test'


router.post('/auth/login', async (req, res) => {
    if (req.body['login'] != login || req.body['password'] != password) {
        res.status(400)
        res.json({
            'error' : 'wrong login'
        })
    } else {
        req.session['subject'] = {
            authenticated: true,
            userId: userId,
            role: 'EXEMPLE'
        }
        res.json({
            "userId": userId
        })
    }
})

router.post('/auth/logout', async (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            console.log(err)
        })
    }

    res.json({
        "logout": "ok"
    })
})

router.get('/auth', async (req, res) => {
    res.json(req.session)
})

export default router