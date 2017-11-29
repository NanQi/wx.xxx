class Cache {

    /**  
     * 获取缓存
     * @author NanQi
     * @param {String} key 缓存键 
     * @return {String} 缓存值
    */
    get(key) {
        try {
            let res = wx.getStorageSync(key)

            if (!res) {
                return ''
            }

            if (res.__expiretime && res.__expiretime < wx.utils.timestamp()) {
                this.remove(key)
                return ''
            } else {
                return res.data
            }
        } catch (e) {
            return ''
        }
    }


    /**  
     * 设置缓存
     * @author NanQi
     * @param {String} key 缓存键 
     * @param {String} value 缓存值
     * @param {Number} expire 指定秒数后过期
     * @return {String} 缓存值
    */
    set(key, value, expire = 600) {
        let cacheItem = {}
        cacheItem.data = value
        if (expire > 0) {
            cacheItem.__expiretime = wx.utils.timestamp() + expire
        }

        return wx.setStorageSync(key, cacheItem)
    }

    /**
     * 有则取缓存，否则从调用回调并保存
     * @author NanQi
     * @param {String} key 缓存键
     * @param {String} callback 回调返回Promise
     * @param {Number} expire 指定秒数后过期
     * @return {Promise} Promise对象
     */
    remember(key, callback, expire = 600) {

        let ret = this.get(key)
        if (!!ret) {
            return Promise.resolve(ret)
        } else {
            return callback().then(val => {
                this.set(key, val, expire)
                return val
            })
        }
    }

    /**  
     * 删除缓存
     * @author NanQi
     * @param {String} key 缓存键 
     * @return {void}
    */
    remove(key) {
        try {
            wx.removeStorageSync(key)
        } catch (e) {

        }
    }

    /**
     * 根据前缀批量删除缓存
     * @author NanQi
     * @param {String} prefix 缓存键的前缀 
     * @return {Promise} Promise对象
     */
    removeList(prefix) {
        let keys = wx.getStorageInfoSync().keys;
        if (!!keys && keys.length > 0) {
            keys.forEach(key => {
                if (key.indexOf(prefix) === 0) {
                    wx.removeStorageSync(key)
                }
            })
        } else {
            return Promise.resolve();
        }

    }

    /**  
     * 清空缓存
     * @author NanQi
     * @return {Promise} Promise对象
    */
    clear() {
        return wx.pro.clearStorage()
    }
}

var cache = new Cache()

wx.cache = cache