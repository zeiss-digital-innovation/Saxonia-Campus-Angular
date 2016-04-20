import {Component, OnInit} from 'angular2/core';
import {Router, RouteConfig, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {OAuth2Service} from '../../services/oauth2.service';
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
        OAuth2Service,
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
        component: LoginComponent
    }
])
export class AppComponent implements OnInit {
    constructor(private _router: Router, private _oauth2Service: OAuth2Service) {}

    ngOnInit() {
        let search = {};
        window.location.search.substr(1).split("&").forEach(function(item) {search[item.split("=")[0]] = item.split("=")[1]});
        this._oauth2Service.doImplicitFlow(search['code'])
            .subscribe(
            () => this._router.navigate(['Overview']),
            () => this._router.navigate(['Login'])
        );
    }
}


