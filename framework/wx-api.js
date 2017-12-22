function request(options) {
    let url = options.url
    options.url = wx.conf.baseUrl + url
    options.method = options.method || 'GET'

    //非GET请求需要设置为form请求
    // if (options.method.toUpperCase() !== 'GET') {
    //     header['Content-Type'] = 'application/x-www-form-urlencoded'
    // }

    return wx.pro.request(options)
        .catch(err => {
            //token过期,则清空token再请求
            if (err.status_code == 499) {
                wx.cache.remove(TOKEN_KEY)
                options.url = url
                return request(options)
            } else {
                return Promise.reject(err)
            }
        })

}

/**
 * 拉取数据(get请求)
 * @author NanQi
 * @param {String} url 请求的URL 
 * @param {Object} data 请求参数 
 * @return {Promise} Promise对象
 */
function fetch(url, data, toast = false) {
    return request({ url, data, toast })
}

/**
 * 执行(post请求)
 * @author NanQi
 * @param {String} url 请求的URL 
 * @param {Object} data 请求参数 
 * @param {String} method 请求方式,默认POST 
 * @return {Promise} Promise对象
 */
function exec(url, data, toast = false, method = 'POST') {
    return request({ url, method, data, toast })
}

wx.api = { fetch, exec }