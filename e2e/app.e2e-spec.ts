import { SaxoniaCampusAngularPage } from './app.po';

describe('saxonia-campus-angular App', () => {
  let page: SaxoniaCampusAngularPage;

  beforeEach(() => {
    page = new SaxoniaCampusAngularPage();
  });

  it('should display navbar', () => {
    page.navigateTo();
    expect(page.getNavbar()).toBeTruthy();
  });
});
