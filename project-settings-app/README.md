# Siemens Project Configurator

This is a clean, single-page Angular application for managing Project Settings config. The project is designed and implemented using the official [Siemens Industrial Experience (iX) Design System](https://element.siemens.io/) components.

## Features
- **Application Shell**: Built using `<ix-application>` frame and `<ix-application-header>` layout wrappers.
- **Responsive Layout**: Designed using Siemens grid row/column systems.
- **Reactive Form Integration**:
  - Handles client name, project name, responsible email, deployment location, and alerting configuration.
  - Form validation states correctly style the Siemens form elements using validation helpers and class bindings.
- **Data output**: Form submissions are validated and then logged directly to the browser console as formatted JSON.

## Technical Architecture
- **Framework**: Angular 22 (Standalone Components)
- **UI Components**: `@siemens/ix-angular` (version 5)
- **State & Validation**: Angular Reactive Forms

## Getting Started

### Local Setup
Ensure you have Node.js installed, then install dependencies:
```bash
npm install
```

### Run Dev Server
Start a local server to view the application:
```bash
npm run start
```
Open [http://localhost:4200/](http://localhost:4200/) to view the web app.

### Running Tests
Execute unit tests using Vitest:
```bash
npm run test
```

### Production Build
Build the application:
```bash
npm run build
```
The compiled files are outputted to the `dist/` directory.
