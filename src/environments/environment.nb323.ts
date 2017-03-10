export const environment = {
  production: false,

  'adfs.auth.url': 'https://adfs.saxsys.de/adfs/oauth2/authorize',
  'adfs.token.url': 'https://nb323.saxsys.de:8443/rest/api/tokenHandler',
  'adfs.logout.url': 'https://adfs.saxsys.de/adfs/ls/?wa=wsignout1.0',
  'client.id': 'campusapp',
  'resource': 'https://nb323.saxsys.de:8443/adfs-saml',
  'redirect.url': 'https://nb323.saxsys.de:4200/campus',
  'backend.url': 'https://nb323.saxsys.de:8443/rest/api'
};
