import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { Observable, throwError } from 'rxjs';
import { catchError, delay, map, mergeMap, retryWhen, tap, zip } from 'rxjs/operators';
import { defer, from, range } from 'rxjs';

import { Slot } from '../model/slot';
import { OAuth2Service } from '../../shared/auth/oauth2.service';
import { HypermediaResource } from '../../shared/rest/hypermedia-resource';
import { RestService } from '../../shared/rest/rest.service';

@Injectable()
export class SlotService {

  private static handleError(error: Response) {
    console.error(error);
    return throwError(error || 'Server error');
  }

  constructor(private http: HttpClient,
              private restService: RestService,
              private oauth2Service: OAuth2Service) {
  }

  getSlots() {
    return defer(() => this.restService.getRest())
      .pipe(
        mergeMap((hypermediaResource: HypermediaResource) => {
          const link = 'slots';
          return defer(() => this.http.get<any>(hypermediaResource._links[link].href))
            .pipe(
              retryWhen(this.retryHandler(link)),
              map(res => <Slot[]> res._embedded.slots)
            );
        }),
        catchError(SlotService.handleError)
      );
  }

  getIndividualSlots() {
    return defer(() => this.restService.getRest())
      .pipe(
        mergeMap((hypermediaResource: HypermediaResource) => {
          const link = 'slots';
          return defer(() => this.http.get<any>(hypermediaResource._links[link].href))
            .pipe(
              retryWhen(this.retryHandler(link)),
              mergeMap(res => from(<Slot[]> res._embedded.slots))
            );
        }),
        catchError(SlotService.handleError)
      );
  }

  getSlot(slot: Slot) {
    const link = 'self';
    return defer(() => this.http.get<Slot>(slot._links[link].href))
      .pipe(
        retryWhen(this.retryHandler(link)),
        catchError(SlotService.handleError)
      );
  }

  register(slot: Slot) {
    const link = 'register';
    return defer(() => this.http.put(slot._links[link].href, ''))
      .pipe(
        retryWhen(this.retryHandler(link)),
        catchError(SlotService.handleError)
      );
  }

  unregister(slot: Slot) {
    const link = 'unregister';
    return defer(() => this.http.delete(slot._links[link].href))
      .pipe(
        retryWhen(this.retryHandler(link)),
        catchError(SlotService.handleError)
      );
  }

  markAsPreferred(slot: Slot) {
    const link = 'mark_as_preferred';
    return defer(() => this.http.put(slot._links[link].href, ''))
      .pipe(
        retryWhen(this.retryHandler(link)),
        catchError(SlotService.handleError)
      );
  }

  unmarkAsPreferred(slot: Slot) {
    const link = 'unmark_as_preferred';
    return defer(() => this.http.delete(slot._links[link].href))
      .pipe(
        retryWhen(this.retryHandler(link)),
        catchError(SlotService.handleError)
      );
  }

  isRegistrationPhase() {
    const link = 'self';
    return this.restService.getRest()
      .pipe(
        map((root: any) => root.registrationPhase !== undefined && root.registrationPhase === true),
        retryWhen(this.retryHandler(link)),
        catchError(SlotService.handleError)
      );
  }

  private retryHandler(link: string) {
    return errors => errors.pipe(
      zip(range(1, 2), error => error),
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
