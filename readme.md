# Saxonia-Campus-Angular now with Angular2

Angular 2 client with Typescript for the Saxonia Campus backend.
Communicates via REST Hateoas with backend.

## Download dependencies

Run `npm install` to resolve dependencies.

## Build and run in development

Configure config/dev.json with the URLs to your local environment.
Configure bs-config.json to run the server over https and include your certificate.

Run `npm start` for serving the app and using it with a browser of your choice.

## Build distribution for environment

Run `npm run gulp -- war --env=test` to build a WAR file for test environment. See app/config folder for environment
configurations.

## Testing

TODO
