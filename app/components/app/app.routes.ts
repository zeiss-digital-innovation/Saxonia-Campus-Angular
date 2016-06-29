import {provideRouter, RouterConfig} from '@angular/router';
import {OverviewComponent} from "../overview/overview.component";
import {LoginFailedComponent} from "../login-failed/login-failed.component";
import {Type} from "@angular/core";

export const routes: RouterConfig = [
    {path: 'overview', component: <Type>OverviewComponent},
    {path: 'loginFailed', component: <Type>LoginFailedComponent}
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes)
];
