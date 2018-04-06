export const environment = {
  production: false,

  'adfs.auth.url': 'https://adfs.saxsys.de/adfs/oauth2/authorize',
  'adfs.token.url': 'https://nb550.saxsys.de:8443/rest/api/tokenHandler',
  'adfs.logout.url': 'https://adfs.saxsys.de/adfs/ls/?wa=wsignout1.0',
  'client.id': 'campusapp',
  'resource': 'https://nb550.saxsys.de:8443/adfs-saml',
  'redirect.url': 'https://nb550.saxsys.de:4200/campus',
  'backend.url': 'https://nb550.saxsys.de:8443/rest/api',
  'app.mode': 'overview'
};
