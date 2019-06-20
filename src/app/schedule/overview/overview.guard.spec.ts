import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { OverviewGuard } from './overview.guard';
import { SlotService } from '../services/slot.service';

class SlotServiceStub {
}

describe('OverviewGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [OverviewGuard, {provide: SlotService, useClass: SlotServiceStub}]
    });
  });

  it('should ...', inject([OverviewGuard], (guard: OverviewGuard) => {
    expect(guard).toBeTruthy();
  }));
});
