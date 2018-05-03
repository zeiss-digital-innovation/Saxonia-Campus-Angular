import { TestBed, async, inject } from '@angular/core/testing';

import { OverviewGuard } from './overview.guard';

describe('OverviewGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OverviewGuard]
    });
  });

  it('should ...', inject([OverviewGuard], (guard: OverviewGuard) => {
    expect(guard).toBeTruthy();
  }));
});
