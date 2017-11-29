//简单事件处理
var event = {};

var eventFunc = new Map();

function one(eventName, fun) {
    let id = wx.utils.guid()

    if (eventFunc.has(eventName)) {
        return
    }

    let funcList = new Map()
    funcList.set(id, fun)

    let id2 = wx.utils.guid()

    let handler = () => {
        remove(eventName, id)
        remove(eventName, id2)
    }
    funcList.set(id2, handler)
    
    eventFunc.set(eventName, funcList)
}

function listen(eventName, fun) {
    let id = wx.utils.guid()

    let funcList = new Map();

    if (eventFunc.has(eventName)) {
        funcList = eventFunc.get(eventName)
    }

    funcList.set(id, fun)

    eventFunc.set(eventName, funcList);

    return id;
}

function fire(eventName, extras) {
    if (eventFunc.has(eventName)) {
        let funcList = eventFunc.get(eventName)

        for (let [key, func] of funcList.entries()) {
            try {
                func(key, extras)
            } catch (e) {
            }
        }
    }
}

function remove(eventName, id) {
    if (eventFunc.has(eventName)) {

        let funcList = eventFunc.get(eventName)
        if (funcList.has(id)) {
            funcList.delete(id)

            if (funcList.size === 0) {
                eventFunc.delete(eventName)
            }
        }
    }
}

wx.event = {
    eventFunc,
    one,
    listen,
    fire,
    remove
}