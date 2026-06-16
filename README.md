# Siemens Project Configurator

A professional, single-page web application for configuring project settings. This application is built with Angular (Standalone components) and implements the official open-source [Siemens Element UI Design System](https://element.siemens.io/) for high-fidelity corporate styling, interactive form behaviors, and dark/light theme options.

---

## 🚀 Key Features

- **Siemens Brand Header**: 
  - Uses the official `<si-application-header>` and `<si-header-brand>` wrappers.
  - Dynamically renders the real, official corporate Siemens logo SVG via Wikimedia Commons CDN.
  - Integrated visual **Dark/Light Mode Toggle** action item built using Element header buttons.
- **Modern Reactivity (Signals)**:
  - Uses Angular Signals (`signal`, `computed`) for reactive state management, enabling high-performance and zone-free rendering.
- **Strongly Typed Reactive Form**:
  - Leverages Angular 14+ typed forms validation (`FormBuilder.nonNullable`) for strict compile-time checks.
  - **Project Information**: Client Name (required), Project Name (required), and Main Commissioner Email (required, format-validated).
  - **Connectivity**: Deployment Location (dropdown selector with crsp locations) and Re-configure Connectivity option.
  - **Alerts**: Custom reusable multi-email validation function (`multiEmailValidator`) validating comma-separated email lists without spaces.
- **Instant JSON Feedback**:
  - Live on-screen rendering of the submitted configuration JSON payload.
  - Logs the formatted JSON configuration payload directly to the console on submission.
- **Robust Theming**:
  - Full integration with Siemens' `SiThemeService`.
  - CSS custom variables overrides ensuring high contrast petrol/white brand logos depending on the active theme (light/dark).
- **Container & Compose Ready**:
  - Production-ready multi-stage `Dockerfile` and `docker-compose.yml` configured to run under **Docker Compose**, **Podman**, or **Docker** using Angular SSR.
  - Secure production environment variable injection pattern using `.dockerignore` file overrides.
- **Automated CI/CD**:
  - Complete GitHub Actions pipeline configured for automatic build, static compilation, and deployment to GitHub Pages.

---

## 🛠️ Technical Architecture

### Tech Stack
- **Framework**: Angular 19/20+ (Standalone configuration)
- **UI Components**: `@siemens/element-ng` & `@siemens/element-theme`
- **State & Validation**: Strongly Typed Reactive Forms with custom validators
- **Reactivity Model**: Angular Signals (`signal`, `computed`)
- **Unit Testing**: Vitest with JSDOM environment mocking
- **Runtime Environment**: Node.js Alpine for lightweight container footprints
- **CI/CD Pipeline**: GitHub Actions (`deploy.yml`)

### Project Directory Structure
```
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Actions deployment to GitHub Pages
├── project-settings-app/
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.ts             # Form validation, Signals state, theme toggle
│   │   │   ├── app.html           # Siemens element template layout
│   │   │   ├── app.scss           # Component styling
│   │   │   ├── app.spec.ts        # Human-like unit tests with browser mocks
│   │   │   └── app.routes.server.ts # Route server configurations
│   │   ├── index.html             # HTML layout initialized with theme assets
│   │   └── styles.scss            # Global SCSS overrides and logo filters
│   ├── tsconfig.app.json          # TypeScript application configurations
│   └── angular.json               # Angular build preprocessor & allowedHosts config
├── Dockerfile                     # Multi-stage production container configuration
├── docker-compose.yml             # Simplified runtime orchestrations & secrets injection
└── .dockerignore                  # Rules to secure environment keys from images
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
   Execute the automated test suite (including simulated user input/output tests):
   ```bash
   npm run test
   ```

4. **Production Build**:
   Build the application:
   ```bash
   npm run build
   ```

---

## 📦 Containerization & Environments

The application is containerized using a multi-stage `Dockerfile` running on Node.js Alpine. Environment secrets are secured by keeping images environment-agnostic and injecting variables at runtime.

### Option A: Using Docker Compose (Recommended)
This approach simplifies configurations and automatically injects local environment files.

1. Create your local configuration file `.env` (this is ignored by Git and Docker builds):
   ```env
   PORT=4000
   NODE_ENV=production
   ```
2. Build and start the container:
   ```bash
   docker compose up -d --build
   ```
3. Stop the services:
   ```bash
   docker compose down
   ```

### Option B: Using Podman
1. **Build the image**:
   ```bash
   podman build -t siemens-configurator .
   ```
2. **Run the container** (injecting variables or passing an `.env` file):
   ```bash
   podman run -d -p 4000:4000 --env-file .env --name siemens-app siemens-configurator
   ```

### Option C: Using Standalone Docker
1. **Build the image**:
   ```bash
   docker build -t siemens-configurator .
   ```
2. **Run the container** (injecting variables or passing an `.env` file):
   ```bash
   docker run -d -p 4000:4000 --env-file .env --name siemens-app siemens-configurator
   ```

Access the running containerized application at **`http://localhost:4000`**.

---

## 💡 Key Design & Engineering Decisions

1. **Angular Signals**:
   - Replaced legacy Zone.js change detection triggers. Signals provide reactive reactivity, rendering updates only when state components shift.
2. **Typed Forms & Custom Validator**:
   - Replaced untyped forms with `nonNullable` reactive controls to enforce type safety.
   - Refactored inline regular expressions into `multiEmailValidator` to simplify logic, facilitate reusability, and make validation testable in isolation.
3. **Allowed Hosts Config**:
   - Fixed host header validation failures (`Header host is not allowed` in containers) by adding specific local networking loopbacks to the Angular builder configurations in `angular.json`.
4. **DOM Mocking in Tests**:
   - The Siemens Element library references browser-only objects (like `ResizeObserver` and `matchMedia`) at construction time. Mocks were created inside `app.spec.ts` to support headless testing.