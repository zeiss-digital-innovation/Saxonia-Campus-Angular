import { Component, Input } from '@angular/core';
import { ModalComponent } from './modal';

@Component({
  selector: 'modal-header',
  templateUrl: './modal-header.html'
})
export class ModalHeaderComponent {
  @Input('show-close') showClose = false;

  constructor(public modal: ModalComponent) {
  }
}
