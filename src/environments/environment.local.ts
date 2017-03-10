et xport const environment = {
  production: false,

  'adfs.auth.url': 'https://adfs.saxsys.de/adfs/oauth2/authorize',
  'adfs.token.url': `https://${HOSTNAME}.saxsys.de:${BACKEND_PORT || '8443'}/rest/api/tokenHandler`,
  'adfs.logout.url': 'https://adfs.saxsys.de/adfs/ls/?wa=wsignout1.0',
  'client.id': 'campusapp',
  'resource': `https://${HOSTNAME}.saxsys.de:${BACKEND_PORT || '8443'}/adfs-saml`,
  'redirect.url': `https://${HOSTNAME}.saxsys.de:4200/campus`,
  'backend.url': `https://${HOSTNAME}.saxsys.de:${BACKEND_PORT || '8443'}/rest/api`
};
