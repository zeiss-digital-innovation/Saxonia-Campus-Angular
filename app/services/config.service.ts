import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ConfigService {
    private _configUrl: string = 'scripts/config.json';
    private _configObservable: Observable<Object>;

    constructor (private _http: Http) {
        this._configObservable = this._http.get(this._configUrl).map(res => res.json()).cache()
    }

    public getConfig(): Observable<Object> {
        return this._configObservable;
    }
}
