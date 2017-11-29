const RepositoryBase = require('RepositoryBase')

class ActivityRepository extends RepositoryBase {
    constructor() {
        super("articleactivities")
    }
}

module.exports = ActivityRepository