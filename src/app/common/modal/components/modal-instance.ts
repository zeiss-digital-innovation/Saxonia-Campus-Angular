import {ElementRef} from '@angular/core';
import {Observable} from 'rxjs/Observable';

declare var jQuery: any;

export enum ModalResult {
  None,
  Close,
  Dismiss
}

export class ModalInstance {

    private suffix = '.ng2-bs3-modal';
    private shownEventName: string = 'shown.bs.modal' + this.suffix;
    private hiddenEventName: string = 'hidden.bs.modal' + this.suffix;

    $modal: any;
    shown: Observable<void>;
    hidden: Observable<ModalResult>;
    result: ModalResult;
    visible = false;

    constructor(private element: ElementRef) {
        this.init();
    }

    open(): Promise<any> {
        return this.show();
    }

    close(): Promise<any> {
        this.result = ModalResult.Close;
        return this.hide();
    }

    dismiss(): Promise<any> {
        this.result = ModalResult.Dismiss;
        return this.hide();
    }

    destroy(): Promise<any> {
        return this.hide().then(() => {
            if (this.$modal) {
                this.$modal.data('bs.modal', null);
                this.$modal.remove();
            }
        });
    }

    private show() {
        const promise = toPromise(this.shown);
        this.$modal.modal('show');
        return promise;
    }

    private hide(): Promise<ModalResult> {
        if (this.$modal && this.visible) {
            const promise = toPromise(this.hidden);
            this.$modal.modal('hide');
            return promise;
        }
        return Promise.resolve(this.result);
    }

    private init() {
        this.$modal = jQuery(this.element.nativeElement.firstElementChild);
        this.$modal.appendTo('body').modal({ show: false });

        this.shown = Observable.fromEvent(this.$modal, this.shownEventName)
            .map(() => {
                this.visible = true;
            });

        this.hidden = Observable.fromEvent(this.$modal, this.hiddenEventName)
            .map(() => {
                const result = (!this.result || <ModalResult>this.result === ModalResult.None)
                    ? ModalResult.Dismiss : this.result;

                this.result = ModalResult.None;
                this.visible = false;

                return result;
            });
    }
}

function toPromise<T>(observable: Observable<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        observable.subscribe(next => {
            resolve(next);
        });
    });
}
