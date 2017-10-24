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
    return new Q.Promise((res, rej) => {
        var interval = () => {
            try {
                if (expression())
                    return res(true);
                else if ((timeout -= 10) < 0)
                    return res(false);
                else
                    setTimeout(interval, 10)
            } catch (e) {
                return rej(e);
            }
        };
        interval();
    });
}