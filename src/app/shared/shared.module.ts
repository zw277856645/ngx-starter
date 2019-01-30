import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2Webstorage } from 'ngx-webstorage';
import { SharedCoreModule } from './shared-core.module';

@NgModule({
    imports: [
        SharedCoreModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        Ng2Webstorage
    ],
    declarations: [],
    exports: [
        SharedCoreModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        Ng2Webstorage
    ]
})
export class SharedModule {
}