import {Component, OnInit} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {AuthService} from '../../services/auth.service';
import {RestService} from '../../services/rest.service';
import {SlotService} from '../../services/slot.service';
import {HomeComponent} from '../home/home.component';
import {NavbarComponent} from '../navbar/navbar.component';
import {OverviewComponent} from '../overview/overview.component';
import {LoginComponent} from '../login/login.component';
import {SlotComponent} from '../slot/slot.component';

@Component({
    selector: 'app',
    templateUrl: 'app/components/app/app.component.html',
    directives: [
        ROUTER_DIRECTIVES,
        NavbarComponent
    ],
    providers: [
        ROUTER_PROVIDERS,
        HTTP_PROVIDERS,
        AuthService,
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
