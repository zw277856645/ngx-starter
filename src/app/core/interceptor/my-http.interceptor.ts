import { Injectable } from '@angular/core';
import {
    HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest, HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ApiResponse, ApiResponseStatus } from './api-response';
import { isArray, isNullOrUndefined, isString } from 'util';
import { ServerConfigsService } from '../service/server-configs.service';
import { NavigationStart, Router } from '@angular/router';
import { clone, isEmptyArray, isRealObject } from '../../shared/util/util';

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {

    constructor(private serverConfigsService: ServerConfigsService,
                private router: Router) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.getUrl(req.url).switchMap(finalUrl => {
            const dupReq = req.clone({
                url: finalUrl,
                params: this.trimParams(req.params),
                body: this.trimBody(req.body),
                withCredentials: true
            });

            return next.handle(dupReq)
                       // 切换导航时取消所有之前未完成的请求
                       .takeUntil(this.router.events.filter(e => e instanceof NavigationStart))
                       .map(event => {
                           if (event instanceof HttpResponse) {
                               return event.clone({ body: this.handlerResponse(event.body) });
                           }

                           return event;
                       })
                       .catch(event => {
                           if (event instanceof HttpErrorResponse) {
                               return Observable.throw(new HttpResponse({
                                   body: this.handlerError(event)
                               }));
                           }
                       });
        });
    }

    private getUrl(url: string) {
        return this.serverConfigsService.getServerUrl().map(serverUrl => {
            return /^https?:\/\//i.test(url) ? url : serverUrl + url;
        });
    }

    private handlerResponse(body: any) {
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

    private handlerError(error: HttpErrorResponse) {
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
            let bd = {};
            for (let k in body) {
                if (body.hasOwnProperty(k)) {
                    let v = this.trimString(body[ k ]);
                    if (!MyHttpInterceptor.isEmptyParam(v)) {
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
                    if (MyHttpInterceptor.isEmptyParam(pm[ k ])) {
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
                ApiResponseStatus[ ApiResponseStatus.SUCCESS ],
                ApiResponseStatus[ ApiResponseStatus.ERROR ]
            ].indexOf(status.toUpperCase()) >= 0;
        }

        return false;
    }

    private static isEmptyParam(v: any) {
        return isNullOrUndefined(v) || (isString(v) && (v as string).length === 0);
    }

}
