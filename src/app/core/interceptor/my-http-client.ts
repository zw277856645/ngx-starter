import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpObserve } from '@angular/common/http/src/client';
import { ApiResponse } from '../model/api-response';

export type ResponseType = 'json' | 'arraybuffer' | 'text' | 'blob';

export interface RequestOptions {
    body?: any;
    headers?: HttpHeaders | {
        [ header: string ]: string | string[];
    };
    observe?: HttpObserve;
    params?: HttpParams | {
        [ param: string ]: any | any[];
    };
    reportProgress?: boolean;
    responseType?: ResponseType;
    withCredentials?: boolean;

    // 扩展属性
    catchError?: boolean;
    errorData?: any;
}

export function myHttpClientCreator(http: HttpClient) {
    return new MyHttpClient(http);
}

@Injectable()
export class MyHttpClient {

    constructor(private http: HttpClient) {
    }

    get<T>(url: string, options?: RequestOptions) {
        return this.handleRequest(this.http.get<T>(url, options as any), options);
    }

    post<T>(url: string, body: any | null, options?: RequestOptions) {
        return this.handleRequest(this.http.post<T>(url, body, options as any), options);
    }

    put<T>(url: string, body: any | null, options?: RequestOptions) {
        return this.handleRequest(this.http.put<T>(url, body, options as any), options);
    }

    delete<T>(url: string, options?: RequestOptions) {
        return this.handleRequest(this.http.delete<T>(url, options as any), options);
    }

    private handleRequest(req: Observable<any>, options: RequestOptions) {
        let ops = Object.assign({
            showErrorDialog: true,
            catchError: true
        }, options);

        return req.catch(err => {
            let errBody = err.body as ApiResponse;
            let data = ('errorData' in ops) ? ops.errorData : errBody;

            return ops.catchError ? Observable.of(data) : Observable.throw(data);
        });
    }

}