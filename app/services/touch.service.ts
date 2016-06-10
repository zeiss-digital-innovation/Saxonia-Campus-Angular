import {Injectable, Output} from '@angular/core';
import {EventEmitter} from '@angular/compiler/src/facade/async';

/**
 * Delegates swipe events from the app to registered children.
 *
 * @author Sven Hoffmann
 * @author Stefan Bley
 */
@Injectable()
export class TouchService {

    /** Event value contains the direction and can be 'left' or 'right'. */
    @Output()
    public swipeEvent:EventEmitter<any> = new EventEmitter();

    public handleSwipeEvent(direction:string) {
        this.swipeEvent.emit(direction);
    }
}