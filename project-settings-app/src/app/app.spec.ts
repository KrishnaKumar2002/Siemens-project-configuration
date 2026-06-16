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
});
