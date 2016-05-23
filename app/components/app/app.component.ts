import {Component, OnInit} from "@angular/core";
import {Router, ROUTER_DIRECTIVES, Routes} from "@angular/router";
import {ConfigService} from "../../services/config.service";
import {OAuth2Service} from "../../services/oauth2.service";
import {RestService} from "../../services/rest.service";
import {SlotService} from "../../services/slot.service";
import {UserService} from "../../services/user.service";
import {NavbarComponent} from "../navbar/navbar.component";
import {OverviewComponent} from "../overview/overview.component";
import {LoginFailedComponent} from "../login-failed/login-failed.component";
import {JwtHelper} from 'angular2-jwt';

@Component({
    selector: 'app',
    templateUrl: 'app/components/app/app.component.html',
    directives: [
        ROUTER_DIRECTIVES,
        NavbarComponent
    ],
    providers: [
        ConfigService,
        OAuth2Service,
        RestService,
        SlotService,
        UserService
    ]
})
@Routes([
    {
        path: '/overview',
        component: OverviewComponent
    },
    {
        path: '/loginFailed',
        component: LoginFailedComponent
    }
])
export class AppComponent implements OnInit {

    private jwtHelper: JwtHelper = new JwtHelper();

    constructor(private _router:Router, private _oauth2Service:OAuth2Service) {
    }

    ngOnInit() {
        let search = {};
        window.location.search.substr(1).split("&").forEach(function (item) {
            search[item.split("=")[0]] = item.split("=")[1]
        });
        this._oauth2Service.doImplicitFlow(search['code'])
            .subscribe(
                () => {
                    let id_token = localStorage.getItem('id_token');
                    let role = this.jwtHelper.decodeToken(id_token).role;
                    let roles = [].concat(role);
                    let isUser = roles.some(entry => {
                        if (entry == 'user' || entry == 'admin') return true;
                    });
                    if (isUser) {
                        this._router.navigate(['/overview'])
                    } else {
                        this._router.navigate(['/loginFailed', {reason: 'unauthorized'}])
                    }
                },
                () => this._router.navigate(['/loginFailed', {reason: 'unauthenticated'}])
            );
    }
}


