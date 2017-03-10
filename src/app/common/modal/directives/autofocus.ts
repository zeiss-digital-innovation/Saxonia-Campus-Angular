import {Directive, ElementRef} from '@angular/core';
import {ModalComponent} from '../components/modal';

@Directive({
    selector: '[campus-autofocus]'
})
export class AutofocusDirective {
    constructor(private el: ElementRef, private modal: ModalComponent) {
        this.modal.onOpen.subscribe(() => {
            this.el.nativeElement.focus();
        });
    }
}
