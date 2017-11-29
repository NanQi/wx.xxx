wx.pro = {}

const functionNames = [
    'login',
    'getUserInfo',
    'checkSession',
    'getStorageInfo',
    'removeStorage',
    'clearStorage',
    'getNetworkType',
    'getSystemInfo',
    'chooseVideo',
    'uploadFile',
    'showLoading',
    'hideLoading',
    'openSetting',
    'getWeRunData',
    'getSetting',
    'chooseLocation',
    'startRecord',
    'canvasToTempFilePath',
    'vibrateShort',
    'downloadFile',
    'getClipboardData',
    'setClipboardData'
]

functionNames.forEach(fnName => {
    wx.pro[fnName] = (obj = {}) => {
        //判断版本过低
        if (!`wx.${fnName}`) return Promise.reject({ message: '当前版本过低, 请升级到最新微信版本后重试!' })

        return new Promise((resolve, reject) => {
            obj.success = res => {
                console.info(`wx.${fnName} success`, res)
                resolve(res)
            }
            obj.fail = err => {
                console.warn(`wx.${fnName} fail`, err)
                reject(err)
            }
            wx[fnName](obj)
        })
    }
})

wx.pro.getStorage = key => {
    return new Promise((resolve, reject) => {
        wx.getStorage({
            key: key,
            success: res => {
                resolve(res.data) // unwrap data
            },
            fail: err => {
                resolve() // not reject, resolve undefined
            }
        })
    })
}

wx.pro.setStorage = (key, value) => {
    return new Promise((resolve, reject) => {
        wx.setStorage({
            key: key,
            data: value,
            success: res => {
                resolve(value) // 将数据返回
            },
            fail: err => {
                reject(err)
            }
        })
    })
}

wx.pro.request = options => {
    if (options.toast) {
        wx.showToast({
            title: options.toast.title || '加载中',
            icon: 'loading'
        })
    }

    return new Promise((resolve, reject) => {
        wx.request({
            url: options.url,
            method: options.method || 'GET',
            header: options.header,
            data: options.data,
            success: res => {
                if (res.statusCode >= 400) {
                    console.warn('wx.request fail [business]', options, res.statusCode, res.data)
                    reject(res.data)
                }
                else {
                    console.info('wx.request success', options, res.data)
                    resolve(res.data) // unwrap data
                }
            },
            fail: err => {
                console.warn('wx.request fail [network]', options, err)
                reject(err)
            },
            complete() {
                if (options.toast) {
                    wx.hideToast()
                }
            }
        })
    })

}

wx.pro.getLocation = () => {
    //判断版本过低
    if (!wx.getLocation) return Promise.reject({ message: '当前版本过低, 请升级到最新微信版本后重试!' })

    return new Promise((resolve, reject) => {
        wx.getLocation({
            type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
            success: res => {
                resolve(res)
            },
            fail: err => {
                reject(err)
            }
        })
    })
}

wx.pro.chooseVideo = () => {
    return new Promise((resolve, reject) => {
        wx.chooseVideo({
            sourceType: ['album'],
            success(res) {
                resolve(res)
            },
            fail(err) {

                if (err.errMsg.indexOf("cancel") != -1) {
                    return;
                }
                reject(err)
            }
        })
    })
}

wx.pro.chooseNewVideo = () => {
    return new Promise((resolve, reject) => {
        wx.chooseVideo({
            sourceType: ['camera'],
            success(res) {
                resolve(res)
            },
            fail(err) {

                if (err.errMsg.indexOf("cancel") != -1) {
                    return;
                }
                reject(err)
            }
        })
    })
}

wx.pro.navigateTo = (pageName, para = null) => {

    let url = wx.url.getUrl(pageName, para)

    return new Promise((resolve, reject) => {
        wx.navigateTo({
            url,
            success(res) {
                resolve(res)
            },
            fail(err) {
                reject(err)
            }
        })
    })
}

wx.pro.redirectTo = (pageName, para = null) => {

    let url = wx.url.getUrl(pageName, para)

    return new Promise((resolve, reject) => {
        wx.redirectTo({
            url,
            success(res) {
                resolve(res)
            },
            fail(err) {
                reject(err)
            }
        })
    })
}

wx.pro.reLaunch = (pageName, para = null) => {
    //判断版本过低
    if (!wx.reLaunch) return Promise.reject({ message: '当前版本过低, 请升级到最新微信版本后重试!' })

    wx.cache.set("reLaunch:data", para);

    let url = wx.url.getUrl(pageName, null)

    return new Promise((resolve, reject) => {
        wx.reLaunch({
            url,
            success(res) {
                resolve(res)
            },
            fail(err) {
                reject(err)
            }
        })
    })
}

wx.pro.requestPayment = (param) => {
    return new Promise((resolve, reject) => {

        let options = {
            timeStamp: param.timestamp,
            nonceStr: param.nonce_str,
            package: param.package,
            signType: param.sign_type,
            paySign: param.pay_sign,
            success(res) {
                resolve(res)
            },
            fail(err) {
                reject(err)
            }
        }
        wx.requestPayment(options)
    })
}

wx.pro.authorize = scope => {
    //判断版本过低
    if (!wx.authorize) return Promise.reject({ message: '当前版本过低, 请升级到最新微信版本后重试!' })

    return new Promise((resolve, reject) => {
        wx.authorize({
            scope,
            success: res => {
                resolve(res.data)
            },
            fail: err => {
                reject(err)
            }
        })
    })
}

wx.pro.chooseImage = (count) => {
    return new Promise((resolve, reject) => {
        wx.chooseImage({
            count: count || 9,
            sizeType: ['compressed'],
            sourceType: ['album'],
            success: function (res) {
                resolve(res)
            },
            fail: function (err) {
                if (err.errMsg.indexOf("cancel") != -1) {
                    return;
                }
                console.warn('chooseImage', err)
            }
        })
    })
}

wx.pro.choosePicture = () => {
    return new Promise((resolve, reject) => {
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['camera'],
            success: function (res) {
                resolve(res)
            },
            fail: function (err) {
                if (err.errMsg.indexOf("cancel") != -1) {
                    return;
                }
                console.warn('chooseImage', err)
            }
        })
    })
}

wx.pro.navigateModal = (pageName, para = null) => {
    let eventName = pageName + '_modal_close'
    if (para == null) {
        para = { eventName }
    } else {
        para.eventName = eventName
    }

    let url = wx.url.getUrl(pageName, para)

    return new Promise((resolve, reject) => {
        wx.navigateTo({
            url,
            success(res) {
                wx.event.one(eventName, (id, { confirm, param }) => {
                    if (confirm) {
                        resolve(param)
                    }
                })
            },
            fail(err) {
                reject(err)
            }
        })
    })
}

wx.pro.showFail = (title, dura = 2000) => {
    wx.showToast({
        title: title || "系统错误",
        duration: dura,
        image: "../../com/close-btn.png"
    })
}

wx.pro.showActionSheet = itemList => {
    return new Promise((resolve, reject) => {
        wx.showActionSheet({
            itemList: itemList,
            success(res) {
                resolve(res)
            }
        })
    })
}

wx.pro.showModal = (title, content) => {
    return new Promise((resolve, reject) => {
        wx.showModal({
            title: title,
            content: content,
            success: function (res) {
                if (res.confirm) {
                    resolve()
                } else if (res.cancel) {
                    reject()
                }
            }
        })
    })
}

wx.pro.showLoading = (title, mask) => {
    return new Promise((resolve, reject) => {
        wx.showLoading({
            title,
            mask,
            success: res => {
                resolve(res)
            },
            fail: err => {
                reject(err)
            }
        })
    })
}

wx.pro.saveImageToPhotosAlbum = filePath => {
    //判断版本过低
    if (!wx.authorize) return Promise.reject({ message: '当前版本过低, 请升级到最新微信版本后重试!' })

    return new Promise((resolve, reject) => {
        wx.saveImageToPhotosAlbum({
            filePath,
            success: res => {
                resolve(res.data)
            },
            fail: err => {
                reject(err)
            }
        })
    })
}

wx.pro.saveFile = tempFilePath => {
    //判断版本过低
    if (!wx.authorize) return Promise.reject({ message: '当前版本过低, 请升级到最新微信版本后重试!' })

    return new Promise((resolve, reject) => {
        wx.saveFile({
            tempFilePath,
            success: res => {
                resolve(res.data)
            },
            fail: err => {
                reject(err)
            }
        })
    })
}

wx.pro.setNavigationBarTitle = title => {

    if (!!title) {
        return new Promise((resolve, reject) => {
            wx.setNavigationBarTitle({
                title,
                success: res => {
                    resolve(res.data)
                },
                fail: err => {
                    reject(err)
                }
            })
        })
    } 
}

wx.pro.showToast = ({ title = "提示", icon = "success", duration = 2000 }) => {
    return new Promise((resolve, reject) => {
        let image = icon;
        if (image == "fail") {
            image = "../../com/close-btn.png"
            wx.showToast({
                title, image, duration, success() {
                    setTimeout(() => {
                        resolve()
                    }, duration)
                }
            })
        } else {
            wx.showToast({
                title, icon, duration, success() {
                    setTimeout(() => {
                        resolve()
                    }, duration)
                }
            })
        }
    })
}