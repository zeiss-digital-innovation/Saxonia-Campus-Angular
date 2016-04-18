///<reference path="../node_modules/angular2/typings/browser.d.ts"/>
import {bootstrap}    from 'angular2/platform/browser';
import {AppComponent} from './components/app/app.component';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {AuthHttp, AuthConfig, AUTH_PROVIDERS} from 'angular2-jwt';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {enableProdMode, provide} from 'angular2/core';
// Add all operators to Observable
import 'rxjs/Rx';

enableProdMode();
bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    AUTH_PROVIDERS,
    provide(LocationStrategy, {useClass: HashLocationStrategy})
]);
