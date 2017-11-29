const DEFAULT_LIMIT = 10;
const Component = require('../components/index')

function setOnLoad(options) {
    let onLoad = options.onLoad

    options.onLoad = function (param) {
        !!onLoad && onLoad.call(this, param)

        if (!!param.eventName) {
            this.eventName = param.eventName;
        }

        if (!!this.loadData) {
            wx.showNavigationBarLoading()
            let prom = this.loadData(param)
            if (prom instanceof Promise) {
                prom.done(_ => {
                    wx.hideNavigationBarLoading()
                })
            } else {
                wx.hideNavigationBarLoading()
            }
        }
    }

    return options
}

wx.page = options => {

    options = setOnLoad(options)

    options = Object.assign({}, Component, options)

    Page(options)
}

wx.listPage = options => {

    options.last_id = 0

    options.initData = function () {
        this.last_id = 0
        this.data.list = []
        this.bindData()
    }

    options.bindData = function () {
        let last_id = this.last_id

        wx.showNavigationBarLoading()

        this.isLoading = true;
        this.loadData && this.loadData({ last_id, limit: DEFAULT_LIMIT })
            .then(res => {

                if(!res){
                    return
                }

                let list = this.data.list
                if (list === undefined) {
                    list = []
                }

                list = list.concat(res.data)

                let info = { list }

                if (res.count < DEFAULT_LIMIT) {
                    info.loadEnd = true
                    info.loadReady = false
                }

                this.last_id = res.last_id
                this.setData(info)
            })
            .done(_ => {
                this.isLoading = false;
                wx.hideNavigationBarLoading()
            })
    }
    let onLoad = options.onLoad

    options.onLoad = function (data) {
        !!onLoad && onLoad.call(this, data)
        this.bindData()
    }

    options.onReachBottom = function () {
        if (this.data.loadEnd || this.isLoading) return
        this.setData({
            loadReady: true
        })

        this.bindData()
    },

    Page(options)
}

wx.modalPage = options => {

    options.modalResult = {
        confirm: false,
        page: null,
        param: null
    }

    options.closeModal = function (param) {
        this.modalResult.confirm = true;
        this.modalResult.param = param;
        wx.navigateBack();
    }

    options.closeAndRedirect = function (pageName, para = null, modalParam = null) {
        this.modalResult.confirm = true;
        this.modalResult.param = modalParam;
        wx.pro.redirectTo(pageName, para)
    }

    let onUnload = options.onUnload

    options.onUnload = function () {
        !!onUnload && onUnload.call(this)
        if (!!this.unloadPage) {
            this.unloadPage().then(obj => {
                this.modalResult.confirm = true;
                this.modalResult.param = obj;
                wx.event.fire(this.eventName, this.modalResult)
            }).catch(_ => {
                wx.event.fire(this.eventName, this.modalResult)
            })
        } else {
            wx.event.fire(this.eventName, this.modalResult)
        }
    }

    wx.page(options)
}