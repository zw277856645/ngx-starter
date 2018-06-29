import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModuleAot } from './app/app.module.aot';

enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModuleAot);
