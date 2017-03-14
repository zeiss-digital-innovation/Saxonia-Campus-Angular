// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  'adfs.auth.url': 'https://adfs.saxsys.de/adfs/oauth2/authorize',
  'adfs.token.url': 'https://localhost:8443/rest/api/tokenHandler',
  'adfs.logout.url': 'https://adfs.saxsys.de/adfs/ls/?wa=wsignout1.0',
  'client.id': 'campusapp',
  'resource': 'https://nb323.saxsys.de:8443/adfs-saml',
  'redirect.url': 'https://localhost:4200/campus',
  'backend.url': 'https://localhost:8443/rest/api'
};
