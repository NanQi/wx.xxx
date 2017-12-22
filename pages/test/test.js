wx.modalPage({
    data: {
        name: ''
    },
    onLoad ({name}) {
        this.setData({name})
    },
    ok() {
        this.closeModal("hello, " + this.data.name)
    },
    cancel() {
        this.closeModal()
    }
})