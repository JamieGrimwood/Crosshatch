const docker = require('dockerode');

exports.getInfo = async (id) => {
    const container = docker.getContainer(id);
    if (!container) return
    container.inspect(function (err, data) {
        console.log(data);
        return data;
    });
}

exports.startContainer = async (id) => {
    const container = docker.getContainer(id);
    if (!container) return
    container.start()
}

exports.stopContainer = async (id) => {
    const container = docker.getContainer(id);
    if (!container) return
    container.stop()
}

exports.stopAllContainers = async () => {
    docker.listContainers(function (err, containers) {
        containers.forEach(function (containerInfo) {
            docker.getContainer(containerInfo.Id).stop(cb);
        });
    });
}

exports.removeContainer = async (id) => {
    const container = docker.getContainer(id);
    if (!container) return
    container.remove()
}

exports.createContainer = async (name, image, ports) => {
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