import { COMPILER_OPTIONS, CompilerFactory, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { MyHttpInterceptor } from './interceptor/my-http.interceptor';
import { HttpModule } from '@angular/http';
import { ServerConfigsService } from './service/server-configs.service';
import { MyHttpClient, myHttpClientCreator } from './interceptor/my-http-client';
import { SharedCoreModule } from '../shared/shared-core.module';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';
import { RuntimeCompiler } from './service/compiler.service';

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
        },

        // for dynamic module
        // AOT会剔除编译模块，此处手动创建一个。若不使用AOT编译或没有动态模块，此配置可以去掉
        {
            provide: COMPILER_OPTIONS,
            useValue: {},
            multi: true
        },
        {
            provide: CompilerFactory,
            useClass: JitCompilerFactory,
            deps: [ COMPILER_OPTIONS ]
        },
        {
            provide: RuntimeCompiler,
            useFactory: (compilerFactory: CompilerFactory) => compilerFactory.createCompiler(),
            deps: [ CompilerFactory ]
        }
    ]
})
export class CoreModule {
}
