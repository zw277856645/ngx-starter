import { Injectable, Injector } from '@angular/core';
import {
    HttpErrorResponse, HttpHandler, HttpInterceptor, HttpParams, HttpRequest, HttpResponse
} from '@angular/common/http';
import { ApiResponse, ApiResponseStatus } from '../model/api-response';
import { ServerConfigsService } from '../service/server-configs.service';
import { NavigationStart, Router } from '@angular/router';
import { clone, isEmptyArray, isRealObject } from '../util/util';
import { catchError, filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { isArray, isNullOrUndefined, isString } from 'cmjs-lib';

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {

    private readonly DELETE_PROPS_PREFIX = '_';
    private serverConfigsService: ServerConfigsService;

    constructor(private router: Router,
                private injector: Injector) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (!this.serverConfigsService) {
            this.serverConfigsService = this.injector.get(ServerConfigsService);

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
                        // 切换导航时取消所有之前未完成的请求
                        takeUntil(this.router.events.pipe(filter(e => e instanceof NavigationStart))),
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
        } else if (isArray(body) || isNullOrUndefined(body)) {
            ret.status = ApiResponseStatus.SUCCESS;
            ret.data = body;

            return ret;
        } else {
            return body;
        }
    }

    private static handlerError(error: HttpErrorResponse) {
        let ret;
        if (error.error && MyHttpInterceptor.isApiResponseStatus(error.error.status)) {
            ret = error.error;
            ret.status = ApiResponseStatus.ERROR;
            ret.detail = ret.data;
        } else if (error.error && error.error.error) {
            ret = new ApiResponse();
            ret.status = ApiResponseStatus.ERROR;
            ret.message = error.error.error;
            ret.detail = error.error.message;
        } else if (isString(error.error)) {
            ret = new ApiResponse();
            ret.status = ApiResponseStatus.ERROR;
            ret.message = error.error;
        } else if (error.status === 0 && error.statusText === 'Unknown Error') {
            ret = new ApiResponse();
            ret.status = ApiResponseStatus.ERROR;
            ret.message = '网络异常，请稍后再试';
        } else {
            ret = new ApiResponse();
            ret.status = ApiResponseStatus.ERROR;
            ret.message = error.message;
        }

        return ret;
    }

    private trimParams(params: HttpParams) {
        if (params && params.keys().length > 0) {
            let pm = {};
            params.keys().forEach(k => {
                let v = this.trimString(params.getAll(k));
                if (!(isEmptyArray(v) || (v.length === 1 && isNullOrUndefined(v[ 0 ])))) {
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
                    if (!isNullOrUndefined(v)) {
                        bd[ k ] = v;
                    }
                }
            }

            return bd;
        }

        return body;
    }

    private trimString(params: any) {
        let pm = clone(params);

        if (isString(pm)) {
            return pm.trim();
        } else if (isRealObject(pm)) {
            for (let k in (pm as any)) {
                if (pm.hasOwnProperty(k)) {
                    pm[ k ] = this.trimString(pm[ k ]);
                    if (isNullOrUndefined(pm[ k ])) {
                        delete pm[ k ];
                    }
                }
            }
        } else if (isArray(pm)) {
            for (let i = 0, len = pm.length; i < len; i++) {
                pm[ i ] = this.trimString(pm[ i ]);
            }
        }

        return pm;
    }

    private static isApiResponseStatus(status: any) {
        if (isString(status)) {
            return [
                ApiResponseStatus.SUCCESS,
                ApiResponseStatus.ERROR
            ].indexOf(status.toUpperCase()) >= 0;
        }

        return false;
    }

    private delDashesProps(obj: any): any {
        if (isArray(obj)) {
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
