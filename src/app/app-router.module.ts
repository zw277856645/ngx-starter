import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    //{
    //    path: '',
    //    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
    //},
    //{
    //    path: 'example',
    //    loadChildren: () => import('./example/example.module').then(m => m.ExampleModule)
    //},
    //{
    //    path: '**',
    //    loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule)
    //}
];

@NgModule({
    imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
    exports: [ RouterModule ]
})
export class AppRouterModule {
}