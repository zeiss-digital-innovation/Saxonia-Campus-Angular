import {Component, OnInit} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {AuthService} from '../../services/auth.service';
import {RestService} from '../../services/rest.service';
import {SlotService} from '../../services/slot.service';
import {UserService} from '../../services/user.service';
import {NavbarComponent} from '../navbar/navbar.component';
import {OverviewComponent} from '../overview/overview.component';
import {LoginComponent} from '../login/login.component';

@Component({
    selector: 'app',
    templateUrl: 'app/components/app/app.component.html',
    directives: [
        ROUTER_DIRECTIVES,
        NavbarComponent
    ],
    providers: [
        HTTP_PROVIDERS,
        AuthService,
        RestService,
        SlotService,
        UserService
    ]
})
@RouteConfig([
    {
        path: '/overview',
        name: 'Overview',
        component: OverviewComponent
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginComponent,
        useAsDefault: true
    }
])
export class AppComponent {}
