import { NgModule } from '@angular/core';

/**
 * 供核心模块和特性模块导入，如有Component、Pipe、Directive需要在核心模块和特性模块同时使用，将其定义在本模块。
 * 不可在SharedModule和SharedCoreModule同时声明，会报重复定义错误
 */
@NgModule({
    imports: [],
    declarations: [],
    exports: []
})
export class SharedCoreModule {
}