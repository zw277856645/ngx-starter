import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, pluck, shareReplay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ServerConfigsService {

    static readonly APP_CONFIG_URL = `app.config.json?ts=${Date.now()}`;

    private source: Observable<any>;

    constructor(private http: HttpClient) {
        this.source = this.http.get(ServerConfigsService.APP_CONFIG_URL).pipe(
            map(res => res || {}),
            shareReplay(1)
        );
    }

    getVersion() {
        return this.source.pipe(pluck('version'));
    }

    getServerUrl() {
        return this.source.pipe(pluck('server_url'));
    }

}
