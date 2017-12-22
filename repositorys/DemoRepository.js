const RepositoryBase = require('RepositoryBase')

class DemoRepository extends RepositoryBase {
    constructor() {
        super("demos")
    }
}

module.exports = DemoRepository