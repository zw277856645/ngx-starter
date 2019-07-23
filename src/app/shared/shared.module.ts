import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const MODULES = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
];

//const COMPONENTS = [];

//const DIRECTIVES = [];

//const PIPES = [];

@NgModule({
    imports: [
        ...MODULES
    ],
    declarations: [
        //...COMPONENTS,
        //...DIRECTIVES,
        //...PIPES
    ],
    exports: [
        ...MODULES,
        //...COMPONENTS,
        //...DIRECTIVES,
        //...PIPES
    ]
})
export class SharedModule {
}