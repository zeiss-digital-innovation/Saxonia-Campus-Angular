///<reference path="../node_modules/angular2/typings/browser.d.ts"/>
import {bootstrap}    from 'angular2/platform/browser';
import {AppComponent} from './components/app/app.component';
// Add all operators to Observable
import 'rxjs/Rx';

bootstrap(AppComponent);
