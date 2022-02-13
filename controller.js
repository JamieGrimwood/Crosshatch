const fs = require("fs");
const Docker = require('dockerode');
const docker = new Docker();

module.exports = {
    listAll: async () => {
        return new Promise((resolve, reject) => {
            docker.listContainers({ all: true }, function (err, containers) {
                if (err) return reject(err)

                resolve(containers)
            });
        });
    },
    getInfo: async (id) => {
        return new Promise(async (resolve, reject) => {
            const container = await docker.getContainer(id);
            container.inspect(function (err, data) {
                if (err) return reject(err)
                if (data.Id != id) reject("notvalid")

                resolve(data)
            });
        });
    },
    getContainer: async (id) => {
        return new Promise(async (resolve, reject) => {
            const container = await docker.getContainer(id);
            container.inspect(function (err, data) {
                if (err) return reject(err)
                if (data.Id != id) reject("notvalid")
            });
            resolve(container)
        });
    },
    startContainer: async (id) => {
        return new Promise(async (resolve, reject) => {
            const container = await docker.getContainer(id);
            container.start()
            container.attach(
                { stream: true, stdout: true, stderr: true },
                (err, stream) => {
                    if (fs.existsSync(`./logs/${id}.txt`) === false) {
                        fs.appendFile(`./logs/${id}.txt`, '', function (err) {
                            if (err) reject(err);
                        });
                    }
                    const messageFile = fs.createWriteStream(`./logs/${id}.txt`, {
                        flags: "a", // 'a' means appending (old data will be preserved)
                    })
                    stream.on('data', chunk => {
                        messageFile.write(chunk.toString("utf8"))
                    })
                }
            );
            resolve(true)
        })
    },
    stopContainer: async (id) => {
        return new Promise(async (resolve, reject) => {
            const container = await docker.getContainer(id);
            container.stop().catch(err => {
                reject(err.statusCode)
            })
            if (fs.existsSync(`./logs/${id}.txt`)) {
                fs.unlink(`./logs/${id}.txt`, (err) => {
                    if (err) {
                        reject(err)
                    }
                })
            }
            resolve(true)
        })
    },
    killContainer: async (id) => {
        return new Promise(async (resolve, reject) => {
            const container = await docker.getContainer(id);
            container.kill().catch(err => {
                reject(err.statusCode)
            })
            if (fs.existsSync(`./logs/${id}.txt`)) {
                await fs.unlink(`./logs/${id}.txt`, (err) => {
                    console.log(err)
                    if (err) {
                        reject(err)
                    }
                    console.log("It should be deleted")
                })
                console.log("It exists")
            }
            resolve(true)
        })
    },
    startAllContainers: async () => {
        return new Promise(async (resolve, reject) => {
            docker.listContainers({ all: true }, function (err, containers) {
                if (err) reject(false);
                containers.forEach(function (containerInfo) {
                    const container = docker.getContainer(containerInfo.Id);

                    container.start().catch(error => {
                        if (error.statusCode === 304) return
                    });
                    container.attach(
                        { stream: true, stdout: true, stderr: true },
                        (err, stream) => {
                            if (fs.existsSync(`./logs/${containerInfo.Id}.txt`) === false) {
                                fs.appendFile(`./logs/${containerInfo.Id}.txt`, '', function (err) {
                                    if (err) reject(err);
                                });
                            }
                            stream.on('data', chunk => {
                                const messageFile = fs.createWriteStream(`./logs/${containerInfo.Id}.txt`, {
                                    flags: "a", // 'a' means appending (old data will be preserved)
                                })

                                messageFile.write(chunk.toString("utf8"))
                            })
                        }
                    );
                });
            });
            resolve(true);
        })
    },
    stopAllContainers: async () => {
        return new Promise(async (resolve, reject) => {
            docker.listContainers({ all: true }, function (err, containers) {
                if (err) reject(false);
                containers.forEach(function (containerInfo) {
                    docker.getContainer(containerInfo.Id).stop().catch(error => {
                        if (error.statusCode === 304) return
                    });
                    if (fs.existsSync(`./logs/${containerInfo.Id}.txt`)) {
                        fs.unlink(`./logs/${containerInfo.Id}.txt`, (err) => {
                            if (err) {
                                reject(err)
                            }
                        })
                    }
                });
            });
            resolve(true);
        })
    },
    killAllContainers: async () => {
        return new Promise(async (resolve, reject) => {
            docker.listContainers({ all: true }, function (err, containers) {
                if (err) reject(false);
                containers.forEach(function (containerInfo) {
                    docker.getContainer(containerInfo.Id).kill().catch(error => {
                        if (error.statusCode === 409) return
                    });
                    if (fs.existsSync(`./logs/${containerInfo.Id}.txt`)) {
                        fs.unlink(`./logs/${containerInfo.Id}.txt`, (err) => {
                            if (err) {
                                reject(err)
                            }
                        })
                    }
                });
            });
            resolve(true);
        })
    },
    // The two below are not used yet.
    removeContainer: async (id) => {
        return new Promise(async (resolve, reject) => {
            const container = docker.getContainer(id);
            if (!container.Name) return reject(false)
            container.remove()
            resolve(true)
        })
    },
    createContainer: async (name, image, ports) => {
        docker.createContainer({
            Image: image,
            name: name,
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true,
            HostConfig: {
                PortBindings: {
                    '80/tcp': [{ HostPort: '80' }], '443/tcp': [{ HostPort: '443' }]
                },
            },
        }).then(function (container) {
            container.start();
        })
    }
}