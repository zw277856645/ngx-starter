import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../model/api-response';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpCacheService } from './http-cache.service';

export type ResponseType = 'json' | 'arraybuffer' | 'text' | 'blob';
export type ObserveType = 'body' | 'events' | 'response';

export interface RequestOptions {
    body?: any;
    headers?: HttpHeaders | {
        [ header: string ]: string | string[];
    };
    observe?: ObserveType;
    params?: HttpParams | {
        [ param: string ]: any | any[];
    };
    reportProgress?: boolean;
    responseType?: ResponseType;
    withCredentials?: boolean;

    // 扩展属性
    showError?: boolean;
    catchError?: boolean;
    errorData?: any;
    cache?: boolean;
    maxCacheAge?: number;
}

export function myHttpClientCreator(http: HttpClient,
                                    httpCacheService: HttpCacheService) {
    return new MyHttpClient(http, httpCacheService);
}

@Injectable()
export class MyHttpClient {

    constructor(private http: HttpClient,
                private httpCacheService: HttpCacheService) {
    }

    get<T>(url: string, options?: RequestOptions) {
        return this.handleRequest('GET', url, options, this.http.get<T>(url, options as any));
    }

    post<T>(url: string, body: any | null, options?: RequestOptions) {
        return this.handleRequest('POST', url, options, this.http.post<T>(url, body, options as any));
    }

    put<T>(url: string, body: any | null, options?: RequestOptions) {
        return this.handleRequest('PUT', url, options, this.http.put<T>(url, body, options as any));
    }

    delete<T>(url: string, options?: RequestOptions) {
        return this.handleRequest('DELETE', url, options, this.http.delete<T>(url, options as any));
    }

    private handleRequest(method: string, url: string, options: RequestOptions, req: Observable<any>) {
        let ops = Object.assign({ showError: true, catchError: true }, options);
        let urlWithParam: any;

        if (method === 'GET' && ops.cache) {
            urlWithParam = MyHttpClient.getUrlWithParams(url, ops.params);

            let response = this.httpCacheService.get(urlWithParam);
            if (response) {
                return of(response);
            }
        }

        return req.pipe(
            tap(event => {
                if (method === 'GET' && ops.cache) {
                    this.httpCacheService.put(urlWithParam, event, ops.maxCacheAge);
                }
            }),
            catchError(err => {
                let errBody = err.body as ApiResponse;
                let data = ('errorData' in ops) ? ops.errorData : errBody;

                if (ops.showError) {
                    // TODO
                }

                return ops.catchError ? of(data) : throwError(data);
            })
        );
    }

    private static getUrlWithParams(url: string, params: HttpParams | { [ param: string ]: any | any[] }) {
        if (!params) {
            return url;
        } else if (params instanceof HttpParams) {
            return url + '?' + params.toString();
        } else {
            return url + '?' + Object.keys(params).map(k => {
                if (Array.isArray(params[ k ])) {
                    return params[ k ].map((v: string) => `${k}=${v}`).join('&');
                } else {
                    return `${k}=${params[ k ]}`;
                }
            }).join('&');
        }
    }

}