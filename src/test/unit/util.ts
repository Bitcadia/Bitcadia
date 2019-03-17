import * as Q from 'bluebird';

export function waitUntil(expression: () => boolean, timeout: number = 1000) {
    return new Q.Promise((res, rej) => {
        const interval = () => {
            try {
                if (expression())
                    return res(true);
                else if ((timeout -= 10) < 0)
                    return res(false);
                else
                    setTimeout(interval, 10);
            } catch (e) {
                return rej(e);
            }
        };
        interval();
    });
}