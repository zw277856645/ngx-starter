import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { MyHttpInterceptor } from './interceptor/my-http.interceptor';
import { ServerConfigsService } from './service/server-configs.service';
import { MyHttpClient, myHttpClientCreator } from './interceptor/my-http-client';
import { SharedCoreModule } from '../shared/shared-core.module';
import { NgxWebstorageModule } from 'ngx-webstorage';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        SharedCoreModule,
        NgxWebstorageModule.forRoot()
    ],
    declarations: [],
    exports: [
        SharedCoreModule
    ],
    providers: [
        ServerConfigsService,

        {
            provide: HTTP_INTERCEPTORS,
            useClass: MyHttpInterceptor,
            multi: true
        },
        {
            provide: MyHttpClient,
            useFactory: myHttpClientCreator,
            deps: [ HttpClient ]
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
