///<reference path="../typings/browser/ambient/es6-shim/index.d.ts"/>
import {bootstrap}    from '@angular/platform-browser-dynamic';
import {AppComponent} from './components/app/app.component';
import {CampusRequestOptions} from './services/campus-request-options';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {ROUTER_PROVIDERS} from '@angular/router';
import {HTTP_PROVIDERS, RequestOptions} from '@angular/http';
import {enableProdMode, provide} from '@angular/core';
// Add all operators to Observable
import 'rxjs/Rx';

enableProdMode();
bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    provide(LocationStrategy, {useClass: HashLocationStrategy}),
    provide(RequestOptions, {useClass: CampusRequestOptions})
]);
