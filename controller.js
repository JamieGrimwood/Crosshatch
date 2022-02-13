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
            resolve(true)
        })
    },
    stopContainer: async (id) => {
        return new Promise(async (resolve, reject) => {
            const container = await docker.getContainer(id);
            container.stop().catch(err => {
                reject(err.statusCode)
            })
            resolve(true)
        })
    },
    killContainer: async (id) => {
        return new Promise(async (resolve, reject) => {
            const container = await docker.getContainer(id);
            container.kill().catch(err => {
                reject(err.statusCode)
            })
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