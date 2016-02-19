import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';
import {Slot} from '../../model/slot';
import {SlotService} from '../../services/slot.service';

@Component({
    templateUrl: 'app/components/overview/overview.component.html'
})
export class OverviewComponent implements OnInit {

    slots: Slot[];

    constructor(private _router: Router, private _slotService: SlotService) {}

    ngOnInit() {
        this.getSlots();
    }

    getSlots() {
        this._slotService.getSlots()
            .subscribe(
                slots => this.slots = slots,
                error => this._router.navigate(['Login']));
    }
}

