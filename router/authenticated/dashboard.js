const express = require('express');
const router = express.Router();

const controller = require('../../controller')

router.get('/dashboard', async (req, res) => {
    const containers = await controller.listAll()

    console.log(containers)

    res.render("dashboard", { containers: containers })
});

module.exports = router;