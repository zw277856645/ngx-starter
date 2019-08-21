import { Injectable } from '@angular/core';
import { isNullOrUndefined } from '../util/util';

@Injectable({
    providedIn: 'root'
})
export class SessionStorageService {

    getItem(k: string) {
        return sessionStorage.getItem(k);
    }

    setItem(k: string, value: any) {
        sessionStorage.setItem(k, value);
    }

    clear() {
        sessionStorage.clear();
    }

    removeItem(k: string) {
        sessionStorage.removeItem(k);
    }
}

export function SessionStorage(key?: string, defaultValue?: any) {
    return function (target: any, propName: string) {
        const rawKey = key || propName;
        let cache: any;

        Object.defineProperty(target, propName, {
            get() {
                if (isNullOrUndefined(cache)) {
                    cache = sessionStorage.getItem(rawKey);
                }

                return isNullOrUndefined(cache) ? defaultValue : cache;
            },
            set(value) {
                cache = value;
                sessionStorage.setItem(rawKey, value);
            }
        });
    };
}