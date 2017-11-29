const AUTH_USERINFO = 'auth:userinfo'
const EXPIRE_USERINFO = -1

const type = 'moding'

function login() {
    return wx.pro.login()
        .then(({code}) => {
            return wx.api.exec('user/app_login', { code, type }, true)
                .catch(err => {
                    if (err.status_code == 491) {
                        return register()
                    } else {
                        console.error('login error', err)
                        return Promise.reject(err)
                    }
                })
        })
        .then(res => {
            wx.cache.set(AUTH_USERINFO, res, EXPIRE_USERINFO)
            return res
        })
}

function register() {
    return Promise.all([wx.pro.login(), wx.pro.getUserInfo()])
        .then(([{code}, {encryptedData, iv}]) => {
            return wx.api.exec('user/app_register', { code, encryptedData, iv, type })
        })
        .then(res => {
            wx.cache.set(AUTH_USERINFO, res, EXPIRE_USERINFO)
            return res
        })
}

function getUserInfo() {
    return wx.cache.get(AUTH_USERINFO)
}

module.exports = {
    login,
    register,
    getUserInfo
}