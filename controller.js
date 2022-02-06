const Docker = require('dockerode');
const docker = new Docker();

module.exports = {
    listAll: async () => {
        docker.listContainers({ all: true }, function (err, containers) {
            console.log(containers)
            if (err) return err;

            return containers;
        });
    },
    getInfo: async (id) => {
        const container = await docker.getContainer(id);
        if (!container) return
        container.inspect(function (err, data) {
            return data;
        });
    },
    startContainer: async (id) => {
        const container = await docker.getContainer(id);
        if (!container) return
        container.start()
    },
    stopContainer: async (id) => {
        const container = docker.getContainer(id);
        if (!container) return
        container.stop()
    },
    stopAllContainers: async () => {
        docker.listContainers(function (err, containers) {
            containers.forEach(function (containerInfo) {
                docker.getContainer(containerInfo.Id).stop(cb);
            });
        });
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