import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CampusCommonModule } from '../common/common.module';
import { OverviewComponent } from './overview/overview.component';
import { SlotComponent } from './slot/slot.component';
import { SlotDetailComponent } from './slot-detail/slot-detail.component';
import { ModalModule } from '../common/modal/modal.module';
import { SlotService } from './services/slot.service';
import { UserService } from './services/user.service';
import { ExportService } from './services/export.service';
import { ListComponent } from './list/list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ModalModule,
    CampusCommonModule,
    MatSlideToggleModule,
  ],
  declarations: [
    OverviewComponent,
    SlotComponent,
    SlotDetailComponent,
    ListComponent,
  ],
  exports: [
    OverviewComponent,
  ],
  providers: [
    {provide: SlotService, useClass: SlotService},
    {provide: UserService, useClass: UserService},
    {provide: ExportService, useClass: ExportService},
  ]
})
export class ScheduleModule {
}
