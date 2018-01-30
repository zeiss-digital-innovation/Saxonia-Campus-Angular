import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Slot } from '../model/slot';
import { OAuth2Service } from '../../shared/auth/oauth2.service';
import { HypermediaResource } from '../../shared/rest/hypermedia-resource';
import { RestService } from '../../shared/rest/rest.service';
import { HttpClient } from '@angular/common/http';
import { catchError, delay, map, mergeMap, retryWhen, zip } from 'rxjs/operators';
import { defer } from 'rxjs/observable/defer';
import { from } from 'rxjs/observable/from';
import { range } from 'rxjs/observable/range';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class SlotService {

  private static handleError(error: Response) {
    console.error(error);
    return ErrorObservable.create(error || 'Server error');
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

  private retryHandler(link: string) {
    return errors => errors.pipe(
      zip(range(1, 2), error => error),
      mergeMap((error: HttpErrorResponse) => {
        if (error.status != 401) {
          return ErrorObservable.create('no automatic retry possible' + error.status);
        }
        // this will essentially automatically retry the request if it can
        console.log(`automatic ${link} retry`);
        return this.oauth2Service.doImplicitFlow(null);
      }),
      delay(250)
    );
  }
}
