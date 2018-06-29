import { Injectable } from '@angular/core';
import {
    HttpErrorResponse, HttpHandler, HttpInterceptor, HttpParams, HttpRequest, HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ApiResponse, ApiResponseStatus } from '../../shared/model/api-response';
import { isArray, isNullOrUndefined, isString } from 'util';
import { ServerConfigsService } from '../service/server-configs.service';

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {

    constructor(private serverConfigsService: ServerConfigsService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return Observable.fromPromise(this.getUrl(req.url)).switchMap(finalUrl => {
            const dupReq = req.clone({
                url: finalUrl,
                params: this.trimParams(req.params),
                body: this.trimBody(req.body),
                withCredentials: true
            });

            return next.handle(dupReq)
                .map(event => {
                    if (event instanceof HttpResponse) {
                        return event.clone({ body: this.handlerResponse(event.body) });
                    }
                    return event;
                })
                .catch(event => {
                    if (event instanceof HttpErrorResponse) {
                        return Observable.throw(new HttpResponse({
                            body: this.handlerError(event, dupReq.params.has('errorSilent'))
                        }));
                    }
                });
        });
    }

    private getUrl(url: string): Promise<string> {
        return this.serverConfigsService.getServerUrl().then(serverUrl => {
            return /^https?:\/\//i.test(url) ? url : serverUrl + url;
        });
    }

    private handlerResponse(body: any) {
        let ret = new ApiResponse();
        if (this.isRealObject(body)) {
            if (this.isApiResponseStatus(body.status)) {
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

    private handlerError(error: HttpErrorResponse, errorSilent: boolean) {
        let ret;
        if (error.error && this.isApiResponseStatus(error.error.status)) {
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
        } else if (error.status == 0 && error.statusText == 'Unknown Error') {
            ret = new ApiResponse();
            ret.status = ApiResponseStatus.ERROR;
            ret.message = '网络异常，请稍后再试';
        } else {
            ret = new ApiResponse();
            ret.status = ApiResponseStatus.ERROR;
            ret.message = error.message;
        }
        if (!errorSilent) {
            this.showError(ret);
        }
        return ret;
    }

    // TODO
    private showError(err: ApiResponse) {
    }

    private isApiResponseStatus(status: any) {
        if (isString(status)) {
            return [
                    ApiResponseStatus[ ApiResponseStatus.SUCCESS ],
                    ApiResponseStatus[ ApiResponseStatus.ERROR ]
                ].indexOf(status.toUpperCase()) >= 0;
        }
        return false;
    }

    private trimParams(params: HttpParams) {
        if (params && params.keys().length > 0) {
            let pm = {};
            params.keys().forEach(k => {
                let v = this.trimString(params.getAll(k));
                if (!this.isUndefinedParam(v)) {
                    pm[ k ] = v;
                }
            });
            return new HttpParams({ fromObject: pm });
        }
        return params;
    }

    private trimBody(body: any) {
        if (this.isRealObject(body) && !(body instanceof FormData)) {
            let bd = {};
            for (let k in body) {
                if (body.hasOwnProperty(k)) {
                    let v = this.trimString(body[ k ]);
                    if (!this.isUndefinedParam(v)) {
                        bd[ k ] = v;
                    }
                }
            }
            return bd;
        }
        return body;
    }

    private trimString(params: any) {
        if (isString(params)) {
            return params.trim();
        } else if (this.isRealObject(params)) {
            for (let k in (<any>params)) {
                if (params.hasOwnProperty(k)) {
                    params[ k ] = this.trimString(params[ k ]);
                }
            }
        } else if (isArray(params)) {
            for (let p of (<any[]>params)) {
                p = this.trimString(p);
            }
        }
        return params;
    }

    private isUndefinedParam(pm: any[]) {
        return isNullOrUndefined(pm) || (pm.length == 1 && pm[ 0 ] === undefined);
    }

    private isRealObject(obj: any) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }
}
