const express = require('express');
const router = express.Router();

const controller = require('../../controller')

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

router.get('/dashboard', async (req, res) => {
    const containers = await controller.listAll()

    res.render("dashboard", { containers_list: containers })
});

router.get('/dashboard/container/:id', async (req, res) => {
    if (!req.params.id) return res.redirect('/dashboard')
    const container = await controller.getInfo(req.params.id)
    res.render("container_overview", { container_info: container })
});

router.post('/dashboard/container/:id/actions/start', async (req, res) => {
    if (!req.params.id) return res.send("No container specified")
    const container = await controller.startContainer(req.params.id)
    if (container === false) return res.send("Invalid container ID")
    await sleep(1000); //wait to give container time to start
    res.redirect(`/dashboard/container/${req.params.id}`)
});

router.post('/dashboard/container/:id/actions/stop', async (req, res) => {
    if (!req.params.id) return res.send("No container specified")
    const container = await controller.stopContainer(req.params.id)
    if (container === false) return res.send("Invalid container ID")
    await sleep(1000); //wait to give container time to stop
    res.redirect(`/dashboard/container/${req.params.id}`)
});

router.post('/dashboard/container/:id/actions/kill', async (req, res) => {
    if (!req.params.id) return res.send("No container specified")
    const container = await controller.killContainer(req.params.id)
    if (container === false) return res.send("Invalid container ID")
    await sleep(1000); //wait to give container time to start
    res.redirect(`/dashboard/container/${req.params.id}`)
});

module.exports = router;