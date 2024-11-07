import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ILocaleCollection } from 'src/app/core/interfaces/i-locale';
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
  private readonly fb = inject(FormBuilder);

  labels: ILocaleCollection = {};
  warnings: ILocaleCollection = {};
  buttons: ILocaleCollection = {};
  headers: ILocaleCollection = {};

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
    };

    this.localeService.getLocales(requestedLocales, 'Login').subscribe({
      next: (locales) => {
        this.labels = locales['labels'] || {};
        this.warnings = locales['warnings'] || {};
        this.buttons = locales['buttons'] || {};
        this.headers = locales['headers'] || {};
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  register() {
    if (this.registrationForm.valid) {
      // Przykładowa akcja po rejestracji
      this.messageService.add({
        summary: 'Registration Success',
        detail: 'Registration was successful!',
        styleClass: 'p-toast',
      });
    }
  }
}
