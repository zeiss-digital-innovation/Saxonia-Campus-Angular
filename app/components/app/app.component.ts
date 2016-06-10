import {Component, OnInit} from "@angular/core";
import {Router, ROUTER_DIRECTIVES, Routes} from "@angular/router";
import {ConfigService} from "../../services/config.service";
import {OAuth2Service} from "../../services/oauth2.service";
import {RestService} from "../../services/rest.service";
import {SlotService} from "../../services/slot.service";
import {UserService} from "../../services/user.service";
import {TouchService} from '../../services/touch.service';
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
        UserService,
        TouchService
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

    private jwtHelper:JwtHelper = new JwtHelper();

    private touch = {
        startX: 0,
        startY: 0,
        startCount: 0,
        captured: false,
        threshold: 40
    };

    constructor(private _router:Router, private _oauth2Service:OAuth2Service, private _touchService:TouchService) {
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


    /**
     * Handler for the 'touchstart' event, enables support for swipe and pinch gestures.
     */
    public onTouchStart(event:TouchEvent) {

        this.touch.startX = event.touches[0].clientX;
        this.touch.startY = event.touches[0].clientY;
        this.touch.startCount = event.touches.length;
    }

    /**
     * Handler for the 'touchmove' event.
     */
    public onTouchMove(event:TouchEvent) {

        event.preventDefault();
        // Each touch should only trigger one action
        if (!this.touch.captured) {

            var currentX = event.touches[0].clientX;
            var currentY = event.touches[0].clientY;

            // There was only one touch point, look for a swipe
            if (event.touches.length === 1 && this.touch.startCount !== 2) {

                var deltaX = currentX - this.touch.startX,
                    deltaY = currentY - this.touch.startY;

                if (deltaX > this.touch.threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
                    this.touch.captured = true;
                    console.log('navigate left');
                    this._touchService.handleSwipeEvent('left');
                }
                else if (deltaX < -this.touch.threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
                    this.touch.captured = true;
                    console.log('navigate right');
                    this._touchService.handleSwipeEvent('right');
                } else {
                    window.scrollBy(0, -deltaY);
                }
            }
        }

    }

    /**
     * Handler for the 'touchend' event.
     */
    public onTouchEnd(event) {
        this.touch.captured = false;
    }

    /**
     * Measures the distance in pixels between point a  and point b.
     *
     * @param {Object} a point with x/y properties
     * @param {Object} b point with x/y properties
     */
    private distanceBetween(a, b) {
        var dx = a.x - b.x,
            dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
   
}


