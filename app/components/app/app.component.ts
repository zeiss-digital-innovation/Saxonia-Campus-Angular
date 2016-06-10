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

    private jwtHelper:JwtHelper = new JwtHelper();
    private touch = {
        startX: 0,
        startY: 0,
        startSpan: 0,
        startCount: 0,
        captured: false,
        threshold: 40
    };

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


    public handleTouchMove(event:TouchEvent) {
        console.log(`Hello ` + event);

        event.preventDefault();
        // window.scrollTo(0, event.touches[0].clientY);

        // let correctedEvent = document.createEvent("TouchEvent");
        // correctedEvent.initEvent("touchmove", false, true);
        //
        // event.view,
        // event.target,
        // event.touches[0].identifier,
        // 0,
        // event.touches[0].pageY,
        // 0,
        // event.touches[0].screenY);
        // event.target.dispatchEvent(correctedEvent);

        // let touch = new Touch({
        //     identifier: new Date(),
        //     target: event.touches[0].target,
        //     pageX: event.touches[0].pageX,
        //     pageY: event.touches[0].pageY,
        //     screenX: event.touches[0].screenX,
        //     screenY: event.touches[0].screenY,
        //     clientX: 0,
        //     clientY: event.touches[0].clientY
        // });
        // let correctedEvent: TouchEvent = new TouchEvent('touchmove', {touches: [touch]});
    }

    /**
     * Handler for the 'touchstart' event, enables support for
     * swipe and pinch gestures.
     */
    public onTouchStart(event:TouchEvent) {

        this.touch.startX = event.touches[0].clientX;
        this.touch.startY = event.touches[0].clientY;
        this.touch.startCount = event.touches.length;

        // If there's two touches we need to memorize the distance
        // between those two points to detect pinching
        if (event.touches.length === 2) {
            this.touch.startSpan = this.distanceBetween({
                x: event.touches[1].clientX,
                y: event.touches[1].clientY
            }, {
                x: this.touch.startX,
                y: this.touch.startY
            });
        }
    }

    /**
     * Handler for the 'touchmove' event.
     */
    public onTouchMove(event:TouchEvent) {

        // Each touch should only trigger one action
        if (!this.touch.captured) {

            var currentX = event.touches[0].clientX;
            var currentY = event.touches[0].clientY;

            // If the touch started with two points and still has
            // two active touches; test for the pinch gesture
            if (event.touches.length === 2 && this.touch.startCount === 2) {

                // The current distance in pixels between the two touch points
                var currentSpan = this.distanceBetween({
                    x: event.touches[1].clientX,
                    y: event.touches[1].clientY
                }, {
                    x: this.touch.startX,
                    y: this.touch.startY
                });

                // If the span is larger than the desire amount we've got
                // ourselves a pinch
                if (Math.abs(this.touch.startSpan - currentSpan) > this.touch.threshold) {
                    this.touch.captured = true;

                    if (currentSpan < this.touch.startSpan) {
                        console.log('activateOverview()');
                    }
                    else {
                        console.log('deactivateOverview()');
                    }
                }

                event.preventDefault();
            }
            // There was only one touch point, look for a swipe
            else if (event.touches.length === 1 && this.touch.startCount !== 2) {

                var deltaX = currentX - this.touch.startX,
                    deltaY = currentY - this.touch.startY;

                if (deltaX > this.touch.threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
                    this.touch.captured = true;
                    console.log('navigateLeft()');
                }
                else if (deltaX < -this.touch.threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
                    this.touch.captured = true;
                    console.log('navigateRight()');
                }
                else if (deltaY > this.touch.threshold) {
                    this.touch.captured = true;
                    console.log('navigateUp()');
                }
                else if (deltaY < -this.touch.threshold) {
                    this.touch.captured = true;
                    console.log('navigateDown()');
                }

                event.preventDefault();
            }
        }
        // There's a bug with swiping on some Android devices unless
        // the default action is always prevented
        else if (navigator.userAgent.match(/android/gi)) {
            event.preventDefault();
        }

    }

    /**
     * Handler for the 'touchend' event.
     */
    public onTouchEnd(event) {
        this.touch.captured = false;
    }

    /**
     * Measures the distance in pixels between point a
     * and point b.
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


