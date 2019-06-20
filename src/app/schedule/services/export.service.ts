import { Injectable } from '@angular/core';
import { Slot } from '../model/slot';
import { saveAs } from 'file-saver';

@Injectable()
export class ExportService {

  exportSlotToIcs(slot: Slot) {
    const icsString: string = this.createIcsContent(slot);
    this.downloadIcsFile(slot, icsString);
  }

  private createIcsContent(slot: Slot) {
    const icsString =
      `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SAXONIA CAMPUS APP/${window.location.host}
METHOD:PUBLISH
BEGIN:VEVENT
UID:${slot.id}
ORGANIZER;CN="Saxonia Campus App":donotreply@saxsys.de
LOCATION:${slot._embedded.room.roomnumber}
SUMMARY:${slot.speaker}: ${slot.title}
DESCRIPTION:${slot.description.replace(/(?:\r\n|\r|\n)/g, '\\n')}
CLASS:PUBLIC
DTSTART:${slot.starttime}
DTEND:${slot.endtime}
DTSTAMP:${new Date().toISOString()}
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;
    return icsString;
  }

  private downloadIcsFile(slot: Slot, icsString: string) {
    const blob = new Blob([icsString], {type: 'text/calendar'});
    saveAs(blob, `campus-${slot.id}.ics`);
  }
}
