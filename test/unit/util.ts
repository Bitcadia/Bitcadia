import * as Q from 'bluebird';

function defer<T>() {
    var resolve: (val?: T | PromiseLike<T>) => void, reject: (reason?: any) => void;
    var promise = new Promise<T>(function (res, rej) {
        resolve = res;
        reject = rej;
    });
    return {
        resolve: resolve,
        reject: reject,
        promise: promise
    };
}
export function waitUntil(expression: () => boolean, timeout: number = 1000) {
    var defered = defer<boolean>();
    var interval = () => {
        try {
            if (expression())
                return defered.resolve(true);
            else if ((timeout -= 10) < 0)
                return defered.resolve(false);
            else
                setTimeout(interval, 10)
        } catch (e) {
            defered.reject(e);
        }
    };
    interval();
    return defered.promise;
}