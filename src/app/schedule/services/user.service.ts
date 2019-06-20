import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { Observable, defer, range, throwError } from 'rxjs';
import { catchError, delay, map, mergeMap, retryWhen, zip } from 'rxjs/operators';
import { User } from '../model/user';
import { HypermediaResource } from '../../shared/rest/hypermedia-resource';
import { OAuth2Service } from '../../shared/auth/oauth2.service';
import { RestService } from '../../shared/rest/rest.service';
import { Slot } from '../model/slot';

@Injectable()
export class UserService {

  private static handleError(error: Response) {
    console.error(error);
    return throwError(error || 'Server error');
  }

  constructor(private http: HttpClient,
              private restService: RestService,
              private oauth2Service: OAuth2Service) {
  }

  getUsersRegisteredSlots(): Observable<Slot[]> {
    const link = 'registeredSlots';
    return this.getUser()
      .pipe(
        mergeMap((user: User) => {
          return defer(() => this.http.get(user._links[link].href))
            .pipe(
              retryWhen(this.retryHandler(link)),
              map(this.mapper)
            )
        }),
        catchError(UserService.handleError)
      );
  }

  getUsersPreferredSlots(): Observable<Slot[]> {
    const link = 'preferredSlots';
    return this.getUser()
      .pipe(
        mergeMap((user: User) => {
          return defer(() => this.http.get(user._links[link].href))
            .pipe(
              retryWhen(this.retryHandler(link)),
              map(this.mapper)
            )
        }),
        catchError(UserService.handleError)
      );
  }

  private mapper(res): Slot[] {
    const embedded = res._embedded;
    if (!embedded || !embedded.slots) {
      return [];
    }
    if (embedded.slots.constructor != Array) {
      return [embedded.slots];
    }
    return embedded.slots;
  }

  private getUser(): Observable<User> {
    return this.restService.getRest()
      .pipe(
        mergeMap((hypermediaResource: HypermediaResource) => {
          const link = 'currentUser';
          return defer(() => this.http.get<User>(hypermediaResource._links[link].href))
            .pipe(
              retryWhen(this.retryHandler(link))
            );
        })
      );
  }

  private retryHandler(link: string) {
    return errors => errors.pipe(
      zip(range(1, 1), error => error),
      mergeMap((error: HttpErrorResponse) => {
        if (error.status != 401) {
          return throwError('no automatic retry possible' + error.status);
        }
        // this will essentially automatically retry the request if it can
        console.log(`automatic ${link} retry`);
        return this.oauth2Service.doImplicitFlow(null);
      }),
      delay(250)
    );
  }


}
