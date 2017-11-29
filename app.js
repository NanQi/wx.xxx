require('framework/bootstrap')
const authService = wx.require.service('Auth')

App({
    getToken() {
        return authService.login()
            .then(({token}) => {
                return token
            })
            .catch(err => {
                if (err.errMsg && err.errMsg.indexOf('auth deny') > -1) {
                    wx.pro.navigateTo('authorize', {id: 1})
                } else {
                    wx.showToast({
                        title: err.message || "系统错误"
                    })
                }
                return Promise.reject()
            })
    },
    getUserInfo() {
        let userInfo = authService.getUserInfo()
        if (!!userInfo) {
            return userInfo
        } else {
            this.getToken().catch(err => {
                console.error('getToken', err)
            })
            return { uid: 0, nickname: "...", avatar: "", is_original: "1", is_public: "1", introduction: "..." }
        }
    },
    onError(error) {
        if (!wx.conf.debug) {
            let sysinfo = wx.getSystemInfoSync()
            wx.api.exec('moding/log', { error, sysinfo })
        }
    }
});