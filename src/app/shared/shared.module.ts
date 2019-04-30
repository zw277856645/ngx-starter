import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedCoreModule } from './shared-core.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedCoreModule
    ],
    declarations: [],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedCoreModule
    ]
})
export class SharedModule {
}