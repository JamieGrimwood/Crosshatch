const fs = require('fs');
const readline = require('readline');
const express = require('express');
const router = express.Router();

const controller = require('../../controller')

router.get('/dashboard', async (req, res) => {
    const containers = await controller.listAll().catch(error => { res.send(error) })

    res.render("dashboard", { containers_list: containers })
});

router.ws('/dashboard', async (ws, req) => {
    ws.on('message', async function (msg) {
        const containers = await controller.listAll().catch(error => { ws.send(error) })
        ws.send(JSON.stringify(containers))
    });
})

router.get('/dashboard/container/:id', async (req, res) => {
    if (!req.params.id) return res.send("Unknown container")
    const container = await controller.getInfo(req.params.id).catch(error => { return res.send("Invalid container ID") })
    res.render("container_overview", { container_info: container })
});

router.ws('/dashboard/container/:id', async (ws, req) => {
    ws.on('message', async function (msg) {
        if (!req.params.id) {
            ws.send("No Container Specified")
            return ws.close()
        }
        const container = await controller.getInfo(req.params.id).catch(error => {
            ws.send("Invalid container ID")
            return ws.close()
        })
        ws.send(JSON.stringify(container))
    });
})

router.get('/dashboard/container/:id/exec', async (req, res) => {
    if (!req.params.id) return res.send("Unknown container")
    const container = await controller.getInfo(req.params.id).catch(error => { return res.send("Invalid container ID") })
    res.render("container_exec", { container_info: container })
})

router.post('/dashboard/container/:id/actions/start', async (req, res) => {
    if (!req.params.id) return res.send("No container specified")
    if (req.params.id === "all") {
        await controller.startAllContainers().catch(error => { return res.send(err) })
    } else {
        await controller.startContainer(req.params.id).catch(error => { return res.send("Invalid container ID") })
    }
    return res.json({ "status": "STARTED" })
});

router.post('/dashboard/container/:id/actions/stop', async (req, res) => {
    if (!req.params.id) return res.send("No container specified")
    if (req.params.id === "all") {
        await controller.stopAllContainers().catch(error => { return res.send(err) })
    } else {
        await controller.stopContainer(req.params.id).catch(error => { return res.send("Invalid container ID") })
    }
    return res.json({ "status": "STOPPED" })
});

router.post('/dashboard/container/:id/actions/kill', async (req, res) => {
    if (!req.params.id) return res.send("No container specified")
    if (req.params.id === "all") {
        await controller.killAllContainers().catch(error => { return res.send(err) })
    } else {
        await controller.killContainer(req.params.id).catch(error => { return res.send("Invalid container ID") })
    }
    return res.json({ "status": "KILLED" })
});

module.exports = router;