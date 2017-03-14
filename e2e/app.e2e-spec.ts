import { SaxoniaCampusAngular4Page } from './app.po';

describe('saxonia-campus-angular4 App', () => {
  let page: SaxoniaCampusAngular4Page;

  beforeEach(() => {
    page = new SaxoniaCampusAngular4Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
