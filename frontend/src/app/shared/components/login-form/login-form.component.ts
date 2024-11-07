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
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, InputTextModule, ButtonModule, PasswordModule, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  loginForm!: FormGroup;

  private readonly messageService = inject(MessageService);
  private readonly localeService = inject(LocaleService)
  private readonly fb = inject(FormBuilder);

  labels: ILocaleCollection = {};
  warnings: ILocaleCollection = {};
  buttons: ILocaleCollection = {};
  headers: ILocaleCollection = {};

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    const requestedLocales = {
      labels: ['login', 'password'],
      warnings: [
        'passwordRequired',
        'loginRequired',
      ],
      buttons: ['login'],
      headers: ['login', 'success', 'fail'],
    };

    this.localeService.getLocales(requestedLocales, 'Login').subscribe({
      next: (locales) => {
        this.labels = locales['labels'] || {};
        this.warnings = locales['warnings'] || {};
        this.buttons = locales['buttons'] || {};
        this.headers = locales['headers'] || {};
      },
      error: (error) => {
        console.error(error)
      },
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.messageService.add({
        summary: 'Login Success',
        detail: 'Login was successful!',
        styleClass: 'p-toast',
      });
    }
  }
}
