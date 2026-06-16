import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Custom validator for comma-separated list of valid email addresses
export function multiEmailValidator(): ValidatorFn {
  const emailRegex = /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    const emails = value.split(',');
    const allValid = emails.every((email: string) => emailRegex.test(email.trim()));
    return allValid ? null : { multiEmail: true };
  };
}
import { RouterOutlet } from '@angular/router';
import {
  SiApplicationHeaderComponent,
  SiHeaderBrandDirective,
  SiHeaderActionsDirective,
  SiHeaderLogoDirective,
  SiHeaderActionItemComponent
} from '@siemens/element-ng/application-header';
import { SiCardModule } from '@siemens/element-ng/card';
import { SiFormModule } from '@siemens/element-ng/form';
import { SiSelectModule } from '@siemens/element-ng/select';
import { SiThemeService } from '@siemens/element-ng/theme';
import { addIcons } from '@siemens/element-ng/icon';
import { elementSun, elementSunFilled } from '@siemens/element-icons';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterOutlet,
    SiApplicationHeaderComponent,
    SiHeaderBrandDirective,
    SiHeaderActionsDirective,
    SiHeaderLogoDirective,
    SiHeaderActionItemComponent,
    SiCardModule,
    SiFormModule,
    SiSelectModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly icons = addIcons({ elementSun, elementSunFilled });
  private readonly fb = inject(FormBuilder);
  private readonly themeService = inject(SiThemeService);

  isDarkMode = signal(false);
  themeIcon = computed(() => this.isDarkMode() ? this.icons.elementSun : this.icons.elementSunFilled);
  themeText = computed(() => this.isDarkMode() ? 'Light' : 'Dark');

  toggleTheme(): void {
    this.isDarkMode.update(prev => !prev);
    const mode = this.isDarkMode() ? 'dark' : 'light';
    this.themeService.applyThemeType(mode);
    
    // Also sync the HTML attribute for bootstrap styling compatibility
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-color-scheme', mode);
      if (mode === 'dark') {
        document.body.classList.add('app--dark');
      } else {
        document.body.classList.remove('app--dark');
      }
    }
  }

  // Form group definition matching requirements and wireframe structure (strongly typed)
  readonly form = this.fb.nonNullable.group({
    clientName: ['', [Validators.required]],
    projectName: ['', [Validators.required]],
    responsibleEmail: ['', [Validators.required, Validators.email]],
    deploymentLocation: ['', [Validators.required]],
    reconfigureConnectivity: ['No', [Validators.required]],
    alertEmails: ['', [multiEmailValidator()]]
  });

  // Holds the formatted JSON result for UI display
  submittedJson = signal<string | null>(null);

  // Helper getters to check validation states for fields
  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control || !control.errors) {
      return '';
    }
    if (control.errors['required']) {
      return 'This field is required.';
    }
    if (control.errors['email']) {
      return 'Please enter a valid email address.';
    }
    if (control.errors['multiEmail']) {
      return 'Please enter a comma-separated list of valid email addresses without spaces (e.g., email1@siemens.com,email2@siemens.com).';
    }
    return 'Invalid field value.';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.submittedJson.set(null);
      return;
    }

    const payload = JSON.stringify(this.form.value, null, 2);
    this.submittedJson.set(payload);
    // Output form data to console in JSON format as required
    console.log(payload);
  }
}
