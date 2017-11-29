Page({
    data: {
        id: 1
    },
    onLoad: function (options) {
        let id = options.id
        this.setData({ id })
    },
    set() {
        if (!!wx.openSetting) {
            wx.openSetting({
                success: (res) => {
                    //   res.authSetting = {
                    //       "scope.werun": true,
                    //       "scope.userInfo": true
                    //   }
                    wx.event.fire("authChange")
                    wx.navigateBack();
                }
            })
        } else {
            wx.showToast({
                title: '当前版本过低',
            })
        }

    }
})