import { Compiler, Inject, Injectable, InjectionToken } from '@angular/core';

export const RuntimeCompiler = new InjectionToken<Compiler>('RuntimeCompiler');

@Injectable()
export class CompilerService {

    constructor(@Inject(RuntimeCompiler) private compiler: Compiler) {
    }

    compileComponent(module: any, comp?: any) {
        let factories = this.compiler.compileModuleAndAllComponentsSync(module).componentFactories;

        if (!factories.length) {
            throw new Error('no components');
        }

        if (!comp && factories.length > 1) {
            let fac = factories.find(factory => factory.selector === 'ng-component');
            if (fac) {
                return fac;
            } else {
                throw new Error('rootComponent not provided');
            }
        }

        return factories.find(factory => factory.componentType === comp) || factories[ 0 ];
    }
}