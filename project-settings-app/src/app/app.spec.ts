import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { App } from './app';

// Mock ResizeObserver for test environment using JSDOM
(window as any).ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock matchMedia for test environment using JSDOM
(window as any).matchMedia = (window as any).matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

// Mock localStorage for test environment using JSDOM
const store: Record<string, string> = {};
(window as any).localStorage = {
  getItem: (key: string) => store[key] || null,
  setItem: (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => { for (const k in store) { delete store[k]; } },
  length: 0,
  key: (index: number) => Object.keys(store)[index] || null
};

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, ReactiveFormsModule],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize with default values', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.form.value).toEqual({
      clientName: '',
      projectName: '',
      responsibleEmail: '',
      deploymentLocation: '',
      reconfigureConnectivity: 'No',
      alertEmails: ''
    });
  });

  it('should be invalid when required fields are empty', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.form.valid).toBeFalsy();
  });

  it('should validate responsibleEmail field format', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const emailControl = app.form.get('responsibleEmail');

    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();

    emailControl?.setValue('test@siemens.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should display validation error message to the user when email format is invalid', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const emailInput = compiled.querySelector('input[formControlName="responsibleEmail"]') as HTMLInputElement;

    // Simulate user typing invalid email
    emailInput.value = 'bad-email';
    emailInput.dispatchEvent(new Event('input'));
    emailInput.dispatchEvent(new Event('blur')); // trigger touch
    fixture.detectChanges();

    // Verify validation error message is shown in the DOM
    const feedback = compiled.querySelector('input[formControlName="responsibleEmail"] ~ .invalid-feedback');
    expect(feedback).toBeTruthy();
    expect(feedback?.textContent).toContain('Invalid email address');
  });

  it('should render the JSON payload on the screen when a human successfully submits the form', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    // Fill in the form values
    const clientInput = compiled.querySelector('input[formControlName="clientName"]') as HTMLInputElement;
    clientInput.value = 'Siemens AG';
    clientInput.dispatchEvent(new Event('input'));

    const projectInput = compiled.querySelector('input[formControlName="projectName"]') as HTMLInputElement;
    projectInput.value = 'Configurator WebApp';
    projectInput.dispatchEvent(new Event('input'));

    const emailInput = compiled.querySelector('input[formControlName="responsibleEmail"]') as HTMLInputElement;
    emailInput.value = 'commissioner@siemens.com';
    emailInput.dispatchEvent(new Event('input'));

    // Select options via Form Control
    const app = fixture.componentInstance;
    app.form.get('deploymentLocation')?.setValue('crsp-emea');
    app.form.get('reconfigureConnectivity')?.setValue('No');
    fixture.detectChanges();

    // Click submit button
    const submitButton = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
    submitButton.click();
    fixture.detectChanges();

    // Verify payload is printed in the <pre> block on the screen
    const preElement = compiled.querySelector('pre');
    expect(preElement).toBeTruthy();
    expect(preElement?.textContent).toContain('"clientName": "Siemens AG"');
    expect(preElement?.textContent).toContain('"projectName": "Configurator WebApp"');
    expect(preElement?.textContent).toContain('"responsibleEmail": "commissioner@siemens.com"');
    expect(preElement?.textContent).toContain('"deploymentLocation": "crsp-emea"');
  });
});
