/**  
 * 转换对象为x-www-form-urlencoded
 * @author NanQi
 * @param {Object} obj  
 * @return {String}  
 */
let transformRequest = obj => {
    let query = '';
    let name, value, fullSubName, subName, subValue, innerObj, i;

    for (name in obj) {
        value = obj[name];

        if (value instanceof Array) {
            for (i = 0; i < value.length; ++i) {
                subValue = value[i];
                fullSubName = name + '[' + i + ']';
                innerObj = {};
                innerObj[fullSubName] = subValue;
                query += param(innerObj) + '&';
            }
        } else if (value instanceof Object) {
            for (subName in value) {
                subValue = value[subName];
                fullSubName = name + '[' + subName + ']';
                innerObj = {};
                innerObj[fullSubName] = subValue;
                query += param(innerObj) + '&';
            }
        } else if (value !== undefined && value !== null) {
            query += encodeURIComponent(name) + '='
                + encodeURIComponent(value) + '&';
        }
    }

    return query.length ? query.substr(0, query.length - 1) : query;
}

let timestamp = function () {
    return Date.parse(new Date()) / 1000;
}

let isNavigating = false;
let isNavigate = () => {
    if (isNavigating) {
        return true;
    } else {
        isNavigating = true;
        setTimeout(() => {
            isNavigating = false;
        }, 2000)
        return false;
    }
}

function dateFormat(date, format) {

    var map = {
        "M": date.getMonth() + 1, //月份 
        "d": date.getDate(), //日 
        "h": date.getHours(), //小时 
        "m": date.getMinutes(), //分 
        "s": date.getSeconds(), //秒 
        "q": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
        var v = map[t];
        if (v !== undefined) {
            if (all.length > 1) {
                v = '0' + v;
                v = v.substr(v.length - 2);
            }
            return v;
        } else if (t === 'y') {
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
}

let guid = (function () {
    let counter = 0;

    return function (prefix) {
        let guid = new Date().getTime().toString(32), i;

        for (i = 0; i < 5; i++) {
            guid += Math.floor(Math.random() * 65535).toString(32);
        }

        return (prefix || '') + guid + (counter++).toString(32);
    };
}());

function isArray(v) {
    return toString.apply(v) === '[object Array]'
}

wx.utils = {
    transformRequest,
    timestamp,
    isNavigate,
    dateFormat,
    guid,
    isArray
}
