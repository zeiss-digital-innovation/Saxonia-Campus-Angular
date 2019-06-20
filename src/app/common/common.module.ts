import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginFailedComponent } from './login-failed/login-failed.component';
import { ModalModule } from './modal/modal.module';
import { NewlinePipe } from './newline.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ModalModule
  ],
  declarations: [
    NavbarComponent,
    LoginFailedComponent,
    NewlinePipe
  ],
  exports: [
    NavbarComponent,
    NewlinePipe
  ],
})
export class CampusCommonModule {
}
