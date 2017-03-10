# Saxonia Campus App built with Angular

Angular client with TypeScript for the Saxonia Campus backend.
Communicates with backend via REST Hateoas.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0-rc.0.

## Download dependencies

Run `npm install` to resolve dependencies.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Prepare your local dev environment

1. Have your SSL certificate and key for your environment ready.
2. Make a copy of `config/dev.json` and adjust the properties to your local environment.
3. Do the same for `proxy.conf.json`.
4. And also for `environments/environment.ts`.
5. Open `.angular-cli.json` and add your environment to the config.
6. Open `package.json` and create a new start script for your environment. Set the correct paths to your config and SSL files.

You are done! :-)

## Build and run in dev environment

Run `npm run <your env>` for serving the app and using it with a browser of your choice.

## The following is copied from version 2.0 and should be changed:

## Build distribution for environment

Run `npm run gulp -- war --env=test` to build a WAR file for test environment. See app/config folder for environment
configurations.

