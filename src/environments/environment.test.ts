export const environment = {
  production: false,

  'adfs.auth.url': 'https://adfs.saxsys.de/adfs/oauth2/authorize',
  'adfs.token.url': 'https://campus-dev.saxsys.de/rest/api/tokenHandler',
  'adfs.logout.url': 'https://adfs.saxsys.de/adfs/ls/?wa=wsignout1.0',
  'client.id': 'campusapp',
  'resource': 'https://campus-dev.saxsys.de/campus',
  'redirect.url': 'https://campus-dev.saxsys.de/campus',
  'backend.url': 'https://campus-dev.saxsys.de/rest/api',
  'app.mode': 'overview'
};
