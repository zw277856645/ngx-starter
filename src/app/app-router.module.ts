import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    //{
    //    path: '',
    //    loadChildren: () => require('es6-promise-loader!./home/home.module')('HomeModule')
    //},
    //{
    //    path: 'example',
    //    loadChildren: () => require('es6-promise-loader!./example/example.module')('ExampleModule')
    //},
    //{
    //    path: '**',
    //    loadChildren: () => require('es6-promise-loader!./not-found/not-found.module')('NotFoundModule')
    //}
];

@NgModule({
    imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
    exports: [ RouterModule ]
})
export class AppRouterModule {
}

