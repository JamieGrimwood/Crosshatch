const express = require('express');
const router = express.Router();

const controller = require('../../controller')

router.get('/dashboard', async (req, res) => {
    const containers = await controller.listAll()

    res.render("dashboard", { containers_list: containers })
});

module.exports = router;