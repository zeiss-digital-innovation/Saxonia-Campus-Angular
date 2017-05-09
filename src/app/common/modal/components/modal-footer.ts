import { Component, Input } from '@angular/core';
import { ModalComponent } from './modal';

@Component({
  selector: 'modal-footer',
  templateUrl: './modal-footer.html',
  styleUrls: ['./modal-footer.scss']
})
export class ModalFooterComponent {
  @Input('show-default-buttons') showDefaultButtons = false;

  constructor(private modal: ModalComponent) {
  }
}
