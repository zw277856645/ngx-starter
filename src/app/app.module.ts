import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AppRouterModule } from './app-router.module';
import { SharedCoreModule } from './shared/shared-core.module';

@NgModule({
    imports: [
        CoreModule,
        SharedCoreModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRouterModule
    ],
    declarations: [ AppComponent ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
