const demoRepository = wx.require.repository('Demo')

wx.listPage({
    loadData(param) {
        return this._getList(param);
    },
    _getList(param) {
        return demoRepository.getList(param)
    },
    add() {
        demoRepository.add({title: 'nanqi'})
            .then(_ => {
                this.initData()
            })
    },
    del({ currentTarget: { dataset: { id } } }) {
        demoRepository.remove(id)
            .then(_ => {
                this.initData()                
            })
    },
    put({ currentTarget: { dataset: { id } } }) {
        demoRepository.save(id, { title: 'my2space'})
            .then(_ => {
                this.initData()
            })
    }
})