import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    //{
    //    path: '',
    //    loadChildren: './home/home.module#HomeModule'
    //},
    //{
    //    path: 'example',
    //    loadChildren: './example/example.module#ExampleModule'
    //},
    //{
    //    path: '**',
    //    loadChildren: './not-found/not-found.module#NotFoundModule'
    //}
];

@NgModule({
    imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
    exports: [ RouterModule ]
})
export class AppRouterModuleAot {
}