import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { CampusCommonModule } from '../common/common.module';
import { OverviewComponent } from './overview/overview.component';
import { SlotComponent } from './slot/slot.component';
import { SlotDetailComponent } from './slot-detail/slot-detail.component';
import { ModalModule } from '../common/modal/modal.module';
import { SlotService } from './services/slot.service';
import { UserService } from './services/user.service';
import { ExportService } from './services/export.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    RouterModule,
    ModalModule,
    CampusCommonModule
  ],
  declarations: [
    OverviewComponent,
    SlotComponent,
    SlotDetailComponent
  ],
  exports: [
    OverviewComponent
  ],
  providers: [
    {provide: SlotService, useClass: SlotService},
    {provide: UserService, useClass: UserService},
    {provide: ExportService, useClass: ExportService},
  ]
})
export class ScheduleModule {
}
