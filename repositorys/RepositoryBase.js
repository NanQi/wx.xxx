class RepositoryBase {

    constructor(resource) {
        this.resource = resource
    }

    getList(query) {
        return wx.api.fetch(this.resource, query)
    }

    getItem(id) {
        const url = this.resource + '/' + id
        return wx.api.fetch(url)
    }

    add(newItem) {
        return wx.api.exec(this.resource, newItem)
    }

    save(id, data) {
        const url = this.resource + '/' + id
        return wx.api.exec(url, data, false, 'PUT')
    }

    remove(id) {
        const url = this.resource + '/' + id
        return wx.api.exec(url, {}, false, 'DELETE')
    }
}

module.exports = RepositoryBase