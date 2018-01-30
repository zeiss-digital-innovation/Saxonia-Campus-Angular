import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import 'hammerjs';

import { AppComponent } from './app.component';
import { CampusCommonModule } from './common/common.module';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { OAuth2Service } from './shared/auth/oauth2.service';
import { ConfigService } from './shared/config/config.service';
import { ScheduleModule } from './schedule/schedule.module';
import { RestService } from './shared/rest/rest.service';
import { AuthTokenInterceptor } from './shared/auth/auth-token-interceptor';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CampusCommonModule,
    ScheduleModule,
    AppRoutingModule,
    RouterModule,
  ],
  providers: [
    {provide: OAuth2Service, useClass: OAuth2Service},
    {provide: ConfigService, useClass: ConfigService},
    {provide: RestService, useClass: RestService},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptor,
      multi: true,
    },
    JwtHelperService,
    {
      provide: JWT_OPTIONS,
      useValue: {}
    },

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
