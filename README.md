# SingleSiteDashboard

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.3.

## Todo

- Websocket for production tracking

## Standards

### Screen display

All components should fit in 100% zoom on Chrome, on 22.9" display.

### Table

- Text is left-aligned, numbers are right-aligned, icons are centered

## First time setup

1. Run npm install

```sh
npm install
```

2. Setup Husky

```sh
npm run husky install
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Architecture

- old MF services? .NET?
- websocket middleware (express JS)
- Why this architeture is because of HTTP CORS issue; most backend services are using HTTP, but dashboard is using HTTPS
- websocket is used to push data from rabbitMQ
- Get the list of APIs required
- Work order 2401120002, 2401120002.01, .02?

## PoC

- MF: Wang li
