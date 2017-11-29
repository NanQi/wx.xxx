const service = (namePrefix) => {
    return require(`../services/${namePrefix}Service`)
}

const framework = (fileName) => {
    return require(fileName);
}

const repository = (namePrefix) => {
    let Repository = require(`../repositorys/${namePrefix}Repository`)
    return new Repository()
}

wx.require = { service, framework, repository }