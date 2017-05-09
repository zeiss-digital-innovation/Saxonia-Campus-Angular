import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import './rxjs-operators';

import { AppComponent } from './app.component';
import { CampusCommonModule } from './common/common.module';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { OAuth2Service } from './shared/auth/oauth2.service';
import { ConfigService } from './shared/config/config.service';
import { ScheduleModule } from './schedule/schedule.module';
import { RestService } from './shared/rest/rest.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CampusCommonModule,
    ScheduleModule,
    AppRoutingModule,
    RouterModule,
  ],
  providers: [
    {provide: OAuth2Service, useClass: OAuth2Service},
    {provide: ConfigService, useClass: ConfigService},
    {provide: RestService, useClass: RestService},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
