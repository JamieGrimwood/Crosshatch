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

router.ws('/dashboard/container/:id/exec', async (ws, req) => {
    if (!req.params.id) {
        ws.send("No Container Specified")
        return ws.close()
    }
    ws.send("\u001b[32m[CROSSHATCH] Connection established.\u001b[0m")
    const container = await controller.getContainer(req.params.id).catch(error => {
        ws.send("Invalid container ID")
        return ws.close()
    })
    ws.on('message', function (msg) {
        const options = {
            'AttachStdout': true,
            'AttachStderr': true,
            'Tty': true,
            Cmd: ["/bin/bash", "-c", msg]
        };
        container.exec(options, async function (err, exec) {
            if (err) {
                if (err.statusCode = 409) {
                    return ws.send("\u001b[31;1m[CROSSHATCH] Container not running. Please start it to be able to use the EXEC console.\u001b[0m")
                }
            }
            const attach_opts = { 'Detach': false, 'Tty': true, stream: true, stdin: true, stdout: true, stderr: true };
            exec.start(attach_opts, function (err, stream) {
                stream.on('data', chunk => {
                    ws.send(chunk.toString("utf8"))
                    if (ws.readyState != 1) return stream.destroy();
                })
            });
        });
    });
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