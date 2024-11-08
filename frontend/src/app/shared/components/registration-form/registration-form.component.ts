import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ILocaleCollection } from 'src/app/core/interfaces/i-locale';
import { AuthService } from 'src/app/core/services/http/auth/auth.service';
import { LoadingService } from 'src/app/core/services/state/loading/loading.service';
import { LocaleService } from 'src/app/core/services/state/locale/locale.service';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [CommonModule, InputTextModule, ButtonModule, PasswordModule, ReactiveFormsModule],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss',
})
export class RegistrationFormComponent {
  registrationForm!: FormGroup;

  private readonly messageService = inject(MessageService);
  private readonly localeService = inject(LocaleService);
  private readonly authService = inject(AuthService)
  private readonly loadingService = inject(LoadingService)
  private readonly fb = inject(FormBuilder);

  labels: ILocaleCollection = {};
  warnings: ILocaleCollection = {};
  buttons: ILocaleCollection = {};
  headers: ILocaleCollection = {};
  messages: ILocaleCollection = {};

  ngOnInit() {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      regUsername: ['', Validators.required],
      regPassword: ['', Validators.required],
    });
    const requestedLocales = {
      labels: ['login', 'email', 'password', 'name'],
      warnings: [
        'requiredField',
        'nameRequired',
        'mailRequired',
        'passwordRequired',
        'loginRequired',
      ],
      buttons: ['register'],
      headers: ['register', 'success', 'fail'],
      messages: ['registrationSuccess', 'registrationFailed']
    };

    this.localeService.getLocales(requestedLocales).subscribe({
      next: (locales) => {
        this.labels = locales['labels'] || {};
        this.warnings = locales['warnings'] || {};
        this.buttons = locales['buttons'] || {};
        this.headers = locales['headers'] || {};
        this.messages = locales['messages'] || {}
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  register() {
    this.loadingService.showLoader(); // Pokazanie loadera na czas rejestracji

    if (this.registrationForm.valid) {
      const { name, email, regUsername, regPassword } = this.registrationForm.value;

      console.log("Sending registration data:", { regUsername, email, regPassword, name });

      this.authService.register(regUsername, email, regPassword, name).subscribe({
        next: () => {
          this.loadingService.hideLoader(); // Ukrycie loadera po udanej rejestracji
          this.messageService.add({
            summary: this.headers['success'],
            detail: this.messages['registrationSuccess'],
            severity: 'success',
            styleClass: 'p-toast',
          });

          // Ewentualne przekierowanie użytkownika po udanej rejestracji
          // this.router.navigate(['/login']);
        },
        error: (error) => {
          this.loadingService.hideLoader(); // Ukrycie loadera w przypadku błędu
          this.messageService.add({
            summary: this.headers['fail'],
            detail: this.messages['registrationFailed'],
            severity: 'error',
            styleClass: 'p-toast',
          });
          console.error('Registration error:', error);
        },
      });
    } else {
      this.loadingService.hideLoader(); // Ukrycie loadera, jeśli formularz jest niepoprawny
      this.messageService.add({
        summary: this.headers['fail'] || 'Registration Failed',
        detail: this.warnings['requiredField'] || 'Please fill in all required fields.',
        severity: 'warn',
        styleClass: 'p-toast',
      });
    }
  }
}
