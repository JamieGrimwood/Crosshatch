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
            if (!container) return
            container.inspect(function (err, data) {
                if (err) return reject(err)

                resolve(data)
            });
        });
    },
    startContainer: async (id) => {
        return new Promise(async (resolve, reject) => {
            const container = await docker.getContainer(id);
            if (!container) return false;
            container.start()
            resolve(true)
        })
    },
    stopContainer: async (id) => {
        return new Promise(async (resolve, reject) => {
            const container = await docker.getContainer(id);
            if (!container) return false;
            container.stop()
            resolve(true)
        })
    },
    killContainer: async (id) => {
        return new Promise(async (resolve, reject) => {
            const container = await docker.getContainer(id);
            if (!container) return false;
            container.kill()
            resolve(true)
        })
    },
    startAllContainers: async () => {
        return new Promise(async (resolve, reject) => {
            docker.listContainers({ all: true }, function (err, containers) {
                if (err) reject(false);
                containers.forEach(function (containerInfo) {
                    docker.getContainer(containerInfo.Id).start();
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
        const container = docker.getContainer(id);
        if (!container) return
        container.remove()
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