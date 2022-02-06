const express = require('express');
const router = express.Router();

const path = require("path");
const fs = require('fs')

router.use('*', async (req, res, next) => {
    if (!req.session.authenticated || req.session.authenticated != true) return res.redirect('/')

    next()
})

fs.readdirSync(path.join(`${__dirname}/authenticated`))
    .filter(file => file.endsWith(".js"))
    .forEach(file => {
        router.use(require(`${__dirname}/authenticated/${file}`));
    });

module.exports = router;