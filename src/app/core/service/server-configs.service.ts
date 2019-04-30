import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, pluck, shareReplay } from 'rxjs/operators';

@Injectable()
export class ServerConfigsService {

    private source: Observable<any>;

    constructor(private http: HttpClient) {
        this.source = this.http.get('app.config.json?ts=' + new Date().getTime()).pipe(
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
