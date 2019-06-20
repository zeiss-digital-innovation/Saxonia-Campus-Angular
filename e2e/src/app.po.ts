import { browser, element, by } from 'protractor';

export class SaxoniaCampusAngularPage {
  navigateTo() {
    return browser.get('/');
  }

  getNavbar() {
    return element(by.css('campus-app campus-navbar'));
  }
}
