const express = require('express')
const router = express.Router();
const settings = require('../settings.json')

router.post('/api/:password/*', async (req, res, next) => {
    if (settings.auth.password == req.params.password) {
        next()
    } else {
        res.send('INCORRECT PASSWORD')
    }
});

router.post('/api/:password/container/:id/', async (req, res) => {
    if (!req.params.id) return res.send("No container specified")
    const info = await controller.getInfo(req.params.id).catch(error => { res.send(error) })
    res.json(info)
});

module.exports = router;