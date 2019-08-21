import { Injectable } from '@angular/core';
import { isNullOrUndefined } from '../util/util';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    getItem(k: string) {
        return localStorage.getItem(k);
    }

    setItem(k: string, value: any) {
        localStorage.setItem(k, value);
    }

    clear() {
        localStorage.clear();
    }

    removeItem(k: string) {
        localStorage.removeItem(k);
    }
}

export function LocalStorage(key?: string, defaultValue?: any) {
    return function (target: any, propName: string) {
        const rawKey = key || propName;
        let cache: any;

        Object.defineProperty(target, propName, {
            get() {
                if (isNullOrUndefined(cache)) {
                    cache = localStorage.getItem(rawKey);
                }

                return isNullOrUndefined(cache) ? defaultValue : cache;
            },
            set(value) {
                cache = value;
                localStorage.setItem(rawKey, value);
            }
        });
    };
}