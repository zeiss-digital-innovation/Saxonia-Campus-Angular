import { Component, Input } from '@angular/core';
import { ModalComponent } from './modal';

@Component({
  selector: 'campus-modal-footer',
  templateUrl: './modal-footer.html',
  styleUrls: ['./modal-footer.scss']
})
export class ModalFooterComponent {
  @Input() showDefaultButtons = false;

  constructor(private modal: ModalComponent) {
  }
}
