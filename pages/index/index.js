wx.page({
    data: {
        list: [
            {
                key: 'wx.url',
            },
            {
                key: 'wx.cache',
            },
            {
                key: 'wx.page',
            },
            {
                key: 'wx.modalPage',
            },
            {
                key: 'repository',
            },
            {
                key: 'wx.api',
            },
            {
                key: 'wx.require',
            },
            {
                key: 'wx.event',
            },
        ]
    },
    wx_url() {
        const before = "/pages/test/test?name=nanqi"

        const after = wx.url.getUrl('test', { name: 'nanqi' })

        test('wx-url', before == after)
    },
    wx_cache() {
        const cacheKey1 = wx.utils.guid()
        const guid1 = wx.utils.guid()
        wx.setStorageSync(cacheKey1, guid1)
        const ret1 = wx.getStorageSync(cacheKey1)

        test('wx-cache before', guid1 == ret1)

        const cacheKey2 = wx.utils.guid()
        const guid2 = wx.utils.guid()
        wx.cache.set(cacheKey2, guid2)
        const ret2 = wx.cache.get(cacheKey2)

        test('wx-cache after', guid2 == ret2)

        const cacheKey3 = wx.utils.guid()
        const guid3 = wx.utils.guid()
        const expire3 = rand(1, 3)
        wx.cache.set(cacheKey3, guid3, expire3)
        const ret3 = wx.cache.get(cacheKey3)

        test('wx-cache 未过期', guid3 == ret3)

        setTimeout(() => {
            const ret = wx.cache.get(cacheKey3)
            test('wx-cache 已过期', ret == '')
        }, (expire3 + 1) * 1000)
    },
    wx_page() {
        /**
         * before Page({})
         * after  wx.page({})
         * 公共方法，如showTopTips可以以组件形式加载到wx.page中
         */
        this.showTopTips('showTopTips')
    },
    wx_modalPage() {
        wx.pro.navigateModal('test', { name: 'nanqi' })
            .then(res => {
                if (!!res) {
                    this.showTopTips(res)
                }
            })
    },
    repository() {
        wx.pro.navigateTo('repository')
    },
    wx_api() {
        wx.api.fetch('demos')
            .then(res => {
                console.log(res)
            })
    },
    wx_require() {
        const str = wx.require.service('bll').chengfabiao()
        console.log(str)
    },
    wx_event() {
        const eventName = 'oneEvent'
        wx.event.one(eventName, (key, extras) => {
            console.log('one', extras)
        })

        const listenId = wx.event.listen(eventName, (key, extras) => {
            console.log('listen', extras)
        })

        wx.event.fire(eventName, { name: 'nanqi' })
        wx.event.fire(eventName, { name: 'nanqi2'})

        wx.event.remove(eventName, listenId)
        wx.event.fire(eventName, { name: 'nanqi3' })        
    }
})

function rand(min, max) {
    return parseInt(Math.random() * (max - min + 1) + min, 10);
}

function test(name, flg) {
    if (!!flg) {
        console.log(name, 'success')
    } else {
        console.error(name, 'fail')
    }
}