import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRouterModuleAot } from './app-router.module.aot';
import { CoreModule } from './core/core.module';
import { SharedCoreModule } from './shared/shared-core.module';

@NgModule({
    imports: [
        CoreModule,
        SharedCoreModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRouterModuleAot
    ],
    declarations: [ AppComponent ],
    bootstrap: [ AppComponent ]
})
export class AppModuleAot {
}
