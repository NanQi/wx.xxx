Promise.prototype.done = function (onFulfilled, onRejected) {
  this.then(onFulfilled, onRejected)
    .catch((reason) => {
      // 抛出一个全局错误
      setTimeout(() => { throw reason }, 0);
    })
}

Promise.allLimit = function (funPromiseList, limit) {
    var funcList = Array.prototype.slice.call(funPromiseList)

    if (funcList.length === 0) return Promise.resolve([])

    if (funcList.length <= limit) return Promise.all(funcList.map(fun => fun()))

    let promiseList = []
    let tmpCount = 0
    let tmpPromiseList = []

    for (var i = 0; i < funcList.length; i++) {
        tmpCount++        
        
        if (tmpCount >= limit || i === funcList.length - 1) {
            
            tmpCount = 0
            tmpPromiseList.push(funcList[i])            
            promiseList.push(tmpPromiseList)
            tmpPromiseList = []
        } else {
            tmpPromiseList.push(funcList[i])
        }
    }

    Promise.all(promiseList[0].map(fun => fun()))

    // return new Promise(function (resolve, reject) {
    //     var remaining = args.length;
    //     function res(i, val) {
    //         try {
    //             if (val && (typeof val === "object" || typeof val === "function")) {
    //                 var then = val.then;
    //                 if (typeof then === "function") {
    //                     then.call(val, function (val) {
    //                         // 对于thenable和promise对象则订阅onFulfilled事件获取处理结果值
    //                         res(i, val);
    //                     }, reject);
    //                     return;
    //                 }
    //             }
    //             args[i] = val;
    //             // 检测是否所有入参都已返回值
    //             if (--remaining === 0) {
    //                 resolve(args);
    //             }
    //         } catch (ex) {
    //             reject(ex);
    //         }
    //     }
    //     for (var i = 0; i < args.length; i++) {
    //         res(i, args[i]);
    //     }
    // });
};