# Siemens Project Configurator

A professional, single-page web application for configuring project settings. This application is built with Angular (Standalone components) and implements the official open-source [Siemens Element UI Design System](https://element.siemens.io/) for high-fidelity corporate styling, interactive form behaviors, and dark/light theme options.

---

## 🚀 Key Features

- **Siemens Brand Header**: 
  - Uses the official `<si-application-header>` and `<si-header-brand>` wrappers.
  - Dynamically renders the real, official corporate Siemens logo SVG via CDN.
  - Integrated visual **Dark/Light Mode Toggle** action item built using Element header buttons.
- **Project Configuration Form**:
  - **Project Information**: Client Name (required), Project Name (required), and Main Commissioner Email (required, format-validated).
  - **Connectivity**: Deployment Location (dropdown selector with crsp locations) and Re-configure Connectivity option.
  - **Alerts**: Alerting Recipient Emails (comma-separated list of emails without spaces).
- **Instant JSON Feedback**:
  - Live on-screen rendering of the submitted configuration JSON payload.
  - Logs the formatted JSON configuration payload directly to the console on submission.
- **Robust Theming**:
  - Full integration with Siemens' `SiThemeService`.
  - CSS custom variables overrides ensuring high contrast petrol/white brand logos depending on the active theme (light/dark).
- **Container Ready**:
  - Production-ready multi-stage `Dockerfile` and `.dockerignore` configured to run under **Podman** or **Docker** using Angular SSR.

---

## 🛠️ Technical Architecture

### Tech Stack
- **Framework**: Angular 22 (Standalone configuration)
- **UI Components**: `@siemens/element-ng` & `@siemens/element-theme`
- **State & Validation**: Angular Reactive Forms (`FormGroup`, `Validators`)
- **Unit Testing**: Vitest with JSDOM environment mocking
- **Runtime Environment**: Node.js Alpine for lightweight container footprints

### Project Directory Structure
```
project-settings-app/
├── src/
│   ├── app/
│   │   ├── app.ts                 # Form logic, validators, theme toggle handler
│   │   ├── app.html               # Siemens element structure & form template
│   │   ├── app.scss               # Component styles
│   │   ├── app.spec.ts            # Unit tests with JSDOM environment mocks
│   │   └── app.routes.server.ts   # Route rendering configuration (CSR-forced for SSR compatibility)
│   ├── index.html                 # Main HTML layout initialized with Siemens themes
│   └── styles.scss                # Global CSS overrides and specific logo selectors
├── tsconfig.app.json              # TypeScript application compiler options
├── Dockerfile                     # Multi-stage production container image configuration
└── .dockerignore                  # Rules to keep container build context clean
```

---

## 💻 Getting Started

### Local Development Setup

1. **Install Dependencies**:
   Navigate to the project directory and run:
   ```bash
   cd project-settings-app
   npm install
   ```

2. **Run Dev Server**:
   Start the local development server:
   ```bash
   npm run start
   ```
   Open **[http://localhost:4200](http://localhost:4200)** in your browser.

3. **Running Unit Tests**:
   Execute the automated test suite:
   ```bash
   npm run test
   ```

4. **Production Build**:
   Build the application:
   ```bash
   npm run build
   ```

---

## 📦 Containerization (Podman & Docker)

This application is fully containerized using a multi-stage `Dockerfile` running on Node.js Alpine.

### Using Podman
1. **Build the image**:
   ```bash
   podman build -t siemens-configurator .
   ```
2. **Run the container**:
   ```bash
   podman run -d -p 4000:4000 --name siemens-app siemens-configurator
   ```

### Using Docker
1. **Build the image**:
   ```bash
   docker build -t siemens-configurator .
   ```
2. **Run the container**:
   ```bash
   docker run -d -p 4000:4000 --name siemens-app siemens-configurator
   ```

Access the containerized application at **`http://localhost:4000`**.

---

## 💡 Key Design & Engineering Decisions

1. **Reactive Forms**:
   - Chosen for robust validation state management.
   - Built custom regular expressions to validate comma-separated email lists without whitespace.

2. **Theme Toggling Specificity**:
   - Overrides the Siemens Element default placeholder logo (`Element logo`) by specifying the custom `--element-brand-logo` variables on `:root.theme-element` and `:root.theme-element.app--dark` classes.
   - Applies CSS `filter: brightness(0) invert(1)` to turn the official petrol logo white in dark mode.

3. **DOM Mocking in Tests**:
   - Because the Siemens Element library references browser-only objects (like `ResizeObserver` and `matchMedia`) at construction time, headless node environments (like Vitest) would fail.
   - We implemented full mocks inside `app.spec.ts` for `ResizeObserver`, `matchMedia`, and `localStorage` to ensure unit tests run and pass successfully.