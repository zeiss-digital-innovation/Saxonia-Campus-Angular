import {Component, OnInit} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {RestService} from '../../services/rest.service'
import {SlotService} from '../../services/slot.service'
import {HomeComponent} from '../home/home.component'
import {OverviewComponent} from '../overview/overview.component'
import {LoginComponent} from '../login/login.component'

@Component({
    selector: 'app',
    templateUrl: 'app/components/app/app.component.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [
        ROUTER_PROVIDERS,
        HTTP_PROVIDERS,
        RestService,
        SlotService
    ]
})
@RouteConfig([
    {
        path: '/home',
        name: 'Home',
        component: HomeComponent,
        useAsDefault: true
    },
    {
        path: '/overview',
        name: 'Overview',
        component: OverviewComponent
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginComponent
    },
])
export class AppComponent {}
