const getUrl = (pageName, para = null) => {
    let url = '/pages/'

    url += pageName + '/' + pageName

    if (!!para) {
        url += '?' + wx.utils.transformRequest(para)
    }

    return url;
}

wx.url = { getUrl }