import { Component, Input } from '@angular/core';
import { ModalComponent } from './modal';

@Component({
  selector: 'campus-modal-header',
  templateUrl: './modal-header.html'
})
export class ModalHeaderComponent {
  @Input() showClose = false;

  constructor(public modal: ModalComponent) {
  }
}
