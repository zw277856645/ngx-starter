import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

export interface CacheEntry {
    url: string;
    response: any;
    entryTime: number;
    maxAge: number;
}

@Injectable({
    providedIn: 'root'
})
export class HttpCacheService {

    cacheMap = new Map<string, CacheEntry>();

    get(url: string) {
        const entry = this.cacheMap.get(url);

        if (!entry) {
            return null;
        }

        if (entry.maxAge === null || entry.maxAge === undefined) {
            return entry.response;
        } else {
            return Date.now() - entry.entryTime > entry.maxAge ? null : entry.response;
        }
    }

    put(url: string, response: HttpResponse<any>, maxAge: number) {
        this.cacheMap.set(url, { url, response, entryTime: Date.now(), maxAge });
        this.deleteExpiredCache();
    }

    private deleteExpiredCache() {
        this.cacheMap.forEach(entry => {
            if (Date.now() - entry.entryTime > entry.maxAge) {
                this.cacheMap.delete(entry.url);
            }
        });
    }
}