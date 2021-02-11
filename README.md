# Trick Taking Simulator

A simple trick taking simulator that let's you play card games online with your friends

## Angular CLI Bootstrapped

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.2.

## Development Web server

Run `ng serve` for a dev server. Navigate to `http://localhost:3000/`. The app will automatically reload if you change any of the source files.

## Node Server

Run `npm run start.server` to start the dev server

Run `npm run dev` to start dev server with [nodemon](https://github.com/remy/nodemon)

For the best developer experience use both `ng serve` and `npm run dev` in different terminals to enable hot reloading on both the front and back-end

## Complete Builds

Run `npm run complete.production` to build the complete application in production mode. Then to start the server, run `npm run start`. This will not work locally has the URL points to the deployed app. 

NOTE: `NODE_ENV` does not need to be assigned in the production start script as this is provided be Heroku

Run `npm run complete.development` to build the complete application in development mode. Then run `npm run start.dev` to start up the application



## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

### Front End Tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Back End Tests

Run `npm run server.test` to execute unit tests with [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/)

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.