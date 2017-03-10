import { NgModule } from '@angular/core';
import { ModalComponent } from './components/modal';
import { ModalHeaderComponent } from './components/modal-header';
import { ModalBodyComponent } from './components/modal-body';
import { ModalFooterComponent } from './components/modal-footer';
import { AutofocusDirective } from './directives/autofocus';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    AutofocusDirective
  ],
  exports: [
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    AutofocusDirective
  ],
})
export class ModalModule {
}
