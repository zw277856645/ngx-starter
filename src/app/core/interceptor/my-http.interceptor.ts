import { Injectable } from '@angular/core';
import {
    HttpErrorResponse, HttpHandler, HttpInterceptor, HttpParams, HttpRequest, HttpResponse
} from '@angular/common/http';
import { ApiResponse, ApiResponseStatus } from '../model/api-response';
import { ServerConfigsService } from './server-configs.service';
import { isEmptyArray, isRealObject } from '../util/util';
import { catchError, map, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {

    private readonly DELETE_PROPS_PREFIX = '_';

    constructor(private serverConfigsService: ServerConfigsService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if ([ ServerConfigsService.APP_CONFIG_URL ].indexOf(req.url) >= 0) {
            return next.handle(req);
        } else {
            return this.getUrl(req.url).pipe(
                switchMap(finalUrl => {
                    const dupReq = req.clone({
                        url: finalUrl,
                        params: this.trimParams(req.params),
                        body: this.trimBody(req.body),
                        withCredentials: true
                    });

                    return next.handle(dupReq).pipe(
                        map(event => {
                            if (event instanceof HttpResponse) {
                                return event.clone({ body: MyHttpInterceptor.handlerResponse(event.body) });
                            }

                            return event;
                        }),
                        catchError(event => {
                            if (event instanceof HttpErrorResponse) {
                                return throwError(new HttpResponse({
                                    body: MyHttpInterceptor.handlerError(event)
                                }));
                            }
                        })
                    );
                })
            );
        }
    }

    private getUrl(url: string) {
        return this.serverConfigsService.getServerUrl().pipe(
            map(serverUrl => /^https?:\/\//i.test(url) ? url : serverUrl + url)
        );
    }

    private static handlerResponse(body: any) {
        let ret = new ApiResponse();
        if (isRealObject(body)) {
            if (MyHttpInterceptor.isApiResponseStatus(body.status)) {
                ret.status = ApiResponseStatus[ (<string>body.status) ];
                ret.message = body.message;
                ret.data = body.data;
            } else {
                ret.status = ApiResponseStatus.SUCCESS;
                ret.data = body;
            }

            return ret;
        } else if (Array.isArray(body) || body === null || body === undefined) {
            ret.status = ApiResponseStatus.SUCCESS;
            ret.data = body;

            return ret;
        } else {
            return body;
        }
    }

    private static handlerError(error: HttpErrorResponse) {
        let ret: ApiResponse;

        if (error.error) {
            if (typeof error.error === 'object') {
                if (MyHttpInterceptor.isApiResponseStatus(error.error.status)) {
                    ret = error.error;
                    ret.status = ApiResponseStatus.ERROR;
                    ret.detail = ret.data;
                } else if (error.error.error) {
                    ret = new ApiResponse();
                    ret.status = ApiResponseStatus.ERROR;
                    ret.message = error.error.error;
                    ret.detail = error.error.message;
                } else {
                    ret = new ApiResponse();
                    ret.status = ApiResponseStatus.ERROR;
                    ret.message = error.error.toString();
                }
            } else {
                ret = new ApiResponse();
                ret.status = ApiResponseStatus.ERROR;
                ret.message = error.error;
            }
        } else if (error.status === 0 && error.statusText === 'Unknown Error') {
            ret = new ApiResponse();
            ret.status = ApiResponseStatus.ERROR;
            ret.message = '网络异常，请稍后再试';
        } else {
            ret = new ApiResponse();
            ret.status = ApiResponseStatus.ERROR;
            ret.message = error.message;
        }

        ret.statusCode = String(error.status);

        return ret;
    }

    private trimParams(params: HttpParams) {
        if (params && params.keys().length > 0) {
            let pm = {};
            params.keys().forEach(k => {
                let v = this.trimString(params.getAll(k));
                if (!(isEmptyArray(v) || (v.length === 1 && (v[ 0 ] === null || v[ 0 ] === undefined)))) {
                    pm[ k ] = v;
                }
            });

            return new HttpParams({ fromObject: pm });
        }

        return params;
    }

    private trimBody(body: any) {
        if (isRealObject(body) && !(body instanceof FormData)) {
            let delBody = this.delDashesProps(body);

            let bd = {};
            for (let k in delBody) {
                if (delBody.hasOwnProperty(k)) {
                    let v = this.trimString(delBody[ k ]);
                    if (!(v === null || v === undefined)) {
                        bd[ k ] = v;
                    }
                }
            }

            return bd;
        }

        return body;
    }

    private trimString(params: any) {
        if (typeof params === 'string') {
            return params.trim();
        } else if (isRealObject(params)) {
            let copy = {};

            for (let k in (params as any)) {
                if (params.hasOwnProperty(k)) {
                    params[ k ] = this.trimString(params[ k ]);
                    if (!(params[ k ] === null || params[ k ] === undefined)) {
                        copy[ k ] = params[ k ];
                    }
                }
            }

            return copy;
        } else if (Array.isArray(params)) {
            for (let i = 0, len = params.length; i < len; i++) {
                params[ i ] = this.trimString(params[ i ]);
            }
        }

        return params;
    }

    private static isApiResponseStatus(status: any) {
        if (typeof status === 'string') {
            return [
                ApiResponseStatus.SUCCESS,
                ApiResponseStatus.ERROR
            ].indexOf(status.toUpperCase() as ApiResponseStatus) >= 0;
        }

        return false;
    }

    private delDashesProps(obj: any): any {
        if (Array.isArray(obj)) {
            let copy = [];

            for (let i = 0, len = obj.length; i < len; i++) {
                copy[ i ] = this.delDashesProps(obj[ i ]);
            }

            return copy;
        } else if (isRealObject(obj)) {
            let copy = {};

            for (let k in obj) {
                if (obj.hasOwnProperty(k)) {
                    if (!k.startsWith(this.DELETE_PROPS_PREFIX)) {
                        copy[ k ] = this.delDashesProps(obj[ k ]);
                    }
                }
            }

            return copy;
        }

        return obj;
    }

}
