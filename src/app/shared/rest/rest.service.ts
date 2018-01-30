import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { OAuth2Service } from '../auth/oauth2.service';
import { Observable } from 'rxjs/Observable';
import { catchError, delay, mergeMap, retryWhen, zip } from 'rxjs/operators';
import { defer } from 'rxjs/observable/defer';
import { range } from 'rxjs/observable/range';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class RestService {

  private static handleError(error: Response) {
    console.error(error);
    return ErrorObservable.create(error || 'Server error');
  }

  constructor(private http: HttpClient, private configService: ConfigService, private oauth2Service: OAuth2Service) {
  }

  public getRest() {
    const config = this.configService.getConfig();
    return defer(() => this.http.get(config['backend.url']))
      .pipe(
        retryWhen(errors =>
          errors.pipe(
            zip(range(1, 2), error => error),
            mergeMap(error => {
              if (error.status != 401) {
                return ErrorObservable.create('no automatic retry possible' + error.status);
              }
              // this will essentially automatically retry the request if it can
              console.log('automatic rest retry');
              return this.oauth2Service.doImplicitFlow(null);
            }),
            delay(250)
          )
        ),
        catchError(RestService.handleError)
      );
  }

}
