import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { MyHttpInterceptor } from './interceptor/my-http.interceptor';
import { MyHttpClient, myHttpClientCreator } from './interceptor/my-http-client';
import { HttpCacheService } from './interceptor/http-cache.service';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MyHttpInterceptor,
            multi: true
        },
        {
            provide: MyHttpClient,
            useFactory: myHttpClientCreator,
            deps: [ HttpClient, HttpCacheService ]
        }
    ]
})
export class CoreModule {

    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('CoreModule只能在根模块(如AppModule)中引用一次');
        }
    }
}
