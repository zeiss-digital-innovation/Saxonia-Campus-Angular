import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {

  public static getAuthHeader(): HttpHeaders {
    let headers: HttpHeaders = new HttpHeaders({'Cache-Control': 'no-cache', 'Pragma': 'no-cache'});

    const token = localStorage.getItem('id_token');
    if (token != null) {
      headers = headers.append('Authorization', 'Bearer ' + token);
    }
    return headers;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const newRequest = req.clone({headers: AuthTokenInterceptor.getAuthHeader()});
    return next.handle(newRequest);
  }
}
