import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ConfigService {
    private configUrl: string = 'scripts/config.json';
    private configObservable: Observable<Object>;

    constructor (private http: Http) {
        this.configObservable = this.http.get(this.configUrl).map(res => res.json()).cache()
    }

    public getConfig(): Observable<Object> {
        return this.configObservable;
    }
}
