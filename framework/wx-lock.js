const queue = require('../lib/js/queue')

const queueList = new Map()

wx.lock = (key, proAction) => new Promise((resolve, reject) => {
    if (!proAction) {
        proAction = key
        key = '__global_key__'
    }

    let q = null

    if (queueList.has(key)) {
        q = queueList.get(key)
    } else {
        q = queue((task, callback) => task(callback), 1)
        queueList.set(key, q)
    }

    q.push((callback) => {
        proAction()
            .then(resolve)
            .catch(reject)
            .done(callback);
    });
});