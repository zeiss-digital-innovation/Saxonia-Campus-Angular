import { Component, Input } from '@angular/core';
import { ModalComponent } from './modal';

@Component({
  selector: 'modal-footer',
  styles: [`
        .btn[hidden] { display: none; }
    `],
  template: `
        <div class="modal-footer">
            <ng-content></ng-content>
            <button type="button" class="btn btn-default" data-dismiss="modal" 
              (click)="modal.dismiss()" [hidden]="!showDefaultButtons">Close</button>
            <button type="button" class="btn btn-primary" (click)="modal.close()" [hidden]="!showDefaultButtons">Save</button>
        </div>
    `
})
export class ModalFooterComponent {
  @Input('show-default-buttons') showDefaultButtons = false;

  constructor(private modal: ModalComponent) {
  }
}