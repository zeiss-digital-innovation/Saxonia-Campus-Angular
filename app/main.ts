///<reference path="../typings/globals/core-js/index.d.ts"/>
import {bootstrap} from '@angular/platform-browser-dynamic';
import {enableProdMode, Type} from '@angular/core';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {HTTP_PROVIDERS} from '@angular/http';
import {APP_ROUTER_PROVIDERS} from "./components/app/app.routes";
import {AppComponent} from './components/app/app.component';
// Add all operators to Observable
import 'rxjs/Rx';

enableProdMode();
bootstrap(<Type> AppComponent, [
    APP_ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
]);
