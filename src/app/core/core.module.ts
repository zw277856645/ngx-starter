import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { MyHttpInterceptor } from './interceptor/my-http.interceptor';
import { HttpModule } from '@angular/http';
import { ServerConfigsService } from './service/server-configs.service';
import { MyHttpClient, myHttpClientCreator } from './interceptor/my-http-client';
import { SharedCoreModule } from '../shared/shared-core.module';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        HttpClientModule,
        SharedCoreModule
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
}
