import { Injectable } from '@angular/core';
import { Slot } from '../model/slot';

@Injectable()
export class ExportService {

  exportSlotToIcs(slot:Slot) {
    const icsString: string = this.createIcsContent(slot);
    this.downloadIcsFile(slot, icsString);
  }

  private createIcsContent(slot: Slot) {
    const icsString: string =
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
    const blob = new Blob(["\ufeff" + icsString], {type: "text/calendar;charset=utf-8;"});
    let fileName = `campus-${slot.id}.ics`;

    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, fileName)
    } else {
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.setAttribute("style", "visibility:hidden");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
