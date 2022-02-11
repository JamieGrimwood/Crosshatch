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

                resolve(data)
            });
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
            container.stop()
            resolve(true)
        })
    },
    killContainer: async (id) => {
        return new Promise(async (resolve, reject) => {
            const container = await docker.getContainer(id);
            container.kill()
            resolve(true)
        })
    },
    startAllContainers: async () => {
        return new Promise(async (resolve, reject) => {
            docker.listContainers({ all: true }, function (err, containers) {
                if (err) reject(false);
                containers.forEach(function (containerInfo) {
                    docker.getContainer(containerInfo.Id).start().catch(error => {
                        if (error.reason === `container already stopped`) return
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
                    docker.getContainer(containerInfo.Id).stop();
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
                    docker.getContainer(containerInfo.Id).kill();
                });
            });
            resolve(true);
        })
    },
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