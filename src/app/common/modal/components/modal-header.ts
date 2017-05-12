import {Component, Input} from '@angular/core';
import {ModalComponent} from './modal';

@Component({
    selector: 'modal-header',
    template: `
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" (click)="modal.dismiss()" 
              [hidden]="!showClose"><span aria-hidden="true">&#215;</span></button>
            <ng-content></ng-content>
        </div>
    `
})
export class ModalHeaderComponent {
    @Input('show-close') showClose = false;
    constructor(public modal: ModalComponent) { }
}
