import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginFailedComponent } from './common/login-failed/login-failed.component';
import { OverviewComponent } from './schedule/overview/overview.component';
import { ListComponent } from './schedule/list/list.component';

export const appRoutes: Routes = [
  {path: '', redirectTo: 'overview', pathMatch: 'full'},
  {path: 'overview', component: OverviewComponent},
  {path: 'list', component: ListComponent},
  {path: 'loginFailed', component: LoginFailedComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
  ],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule {
}
