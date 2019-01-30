import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class ServerConfigsService {

    private source: Observable<any>;

    constructor(private http: Http) {
        this.source = this.http
                          .get('app.config.json?ts=' + new Date().getTime())
                          .map(res => res.json() || {})
                          .shareReplay(1);
    }

    getVersion() {
        return this.source.pluck<any, string>('version');
    }

    getServerUrl() {
        return this.source.pluck<any, string>('server_url');
    }

}
