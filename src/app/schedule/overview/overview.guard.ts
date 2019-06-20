import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SlotService } from '../services/slot.service';

@Injectable()
export class OverviewGuard implements CanActivate {

  constructor(private slotService: SlotService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.slotService.isRegistrationPhase().pipe(
      tap(isRegistrationPhase => {
        if (!isRegistrationPhase) {
          this.router.navigate(['/list']);
        }
      })
    );
  }
}
