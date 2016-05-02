///<reference path="../node_modules/angular2/typings/browser.d.ts"/>
import {bootstrap}    from 'angular2/platform/browser';
import {AppComponent} from './components/app/app.component';
import {CampusRequestOptions} from './services/campus-request-options';
import {LocationStrategy, HashLocationStrategy} from 'angular2/platform/common';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {Http, HTTP_PROVIDERS, RequestOptions} from 'angular2/http';
import {enableProdMode, provide} from 'angular2/core';
// Add all operators to Observable
import 'rxjs/Rx';

enableProdMode();
bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    provide(LocationStrategy, {useClass: HashLocationStrategy}),
    provide(RequestOptions, {useClass: CampusRequestOptions})
]);
