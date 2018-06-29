import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class ServerConfigsService {

    private promise: Promise<any>;
    private config: any;

    constructor(private http: Http) {
        this.promise = this.http.get(window.location.protocol + '/app.config.json?ts=' + new Date().getTime())
            .map(res => res.json())
            .toPromise()
            .then(res => this.config = res || {});
    }

    getVersion(): Promise<string> {
        return this.promise.then(() => this.config.version);
    }

    getServerUrl(): Promise<string> {
        return this.promise.then(() => this.config.server_url);
    }

    getSSOUrl(): Promise<string> {
        return this.promise.then(() => this.config.sso_url);
    }

    getGrafanaUrl(): Promise<string> {
        return this.promise.then(() => this.config.grafana_url);
    }

}
