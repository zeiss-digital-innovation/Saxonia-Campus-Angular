import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';
import {RestService} from '../../services/rest.service';

@Component({
    template: ''
})
export class HomeComponent implements OnInit {

    ngOnInit() {
        this.getBaseResource();
    }

    constructor(private _router: Router, private _restService: RestService) {}

    getBaseResource() {
        this._restService.getRest()
            .subscribe(
                result => this._router.navigate(['Overview']),
                error => this._router.navigate(['Login'])
        );
    }
}

