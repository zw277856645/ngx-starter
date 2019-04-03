import { isNullOrUndefined } from 'util';

export function clone<T>(obj: T): T {
    if (!obj) {
        return obj;
    }

    let str = JSON.stringify(obj);
    if (str) {
        return JSON.parse(str);
    }

    return obj;
}

export function getType(obj: any) {
    return Object.prototype.toString.call(obj);
}

export function isRealObject(obj: any) {
    return getType(obj) === '[object Object]';
}

export function isEmptyArray(arr: any) {
    return Array.isArray(arr) && arr.length === 0;
}

export function isEmptyObject(obj: any) {
    if (!obj || !isRealObject(obj)) {
        return false;
    }

    for (let e in obj) {
        if (obj.hasOwnProperty(e)) {
            return false;
        }
    }

    return true;
}

export function uniqueArray(arr: any[]) {
    let result = [], hash = {};
    for (let i = 0, elem; !isNullOrUndefined(elem = arr[ i ]); i++) {
        if (!hash[ elem ]) {
            result.push(elem);
            hash[ elem ] = true;
        }
    }

    return result;
}