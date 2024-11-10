import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ILocaleCollection } from 'src/app/core/interfaces/i-locale';
import { AuthService } from 'src/app/core/services/http/auth/auth.service';
import { ErrorHandlingService } from 'src/app/core/services/state/error-handling/error-handling.service';
import { LoadingService } from 'src/app/core/services/state/loading/loading.service';
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
  private readonly authService = inject(AuthService)
  private readonly loadingService = inject(LoadingService)
  private readonly errorHandlingService = inject(ErrorHandlingService)
  private readonly fb = inject(FormBuilder);

  labels: ILocaleCollection = {};
  warnings: ILocaleCollection = {};
  buttons: ILocaleCollection = {};
  headers: ILocaleCollection = {};
  messages: ILocaleCollection = {};

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
      messages: ['loginSuccess', 'loginFailed']
    };

    this.localeService.getLocales(requestedLocales).subscribe({
      next: (locales) => {
        this.labels = locales['labels'] || {};
        this.warnings = locales['warnings'] || {};
        this.buttons = locales['buttons'] || {};
        this.headers = locales['headers'] || {};
        this.messages = locales['messages'] || {};
      },
      error: (error) => {
        this.errorHandlingService.displayNonCriticalError(error.header, error.message)
      },
    });
  }

  login() {
    this.loadingService.showLoader(); // Pokazanie loadera na czas logowania

    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      
      this.authService.login(username, password).subscribe({
        next: () => {
          this.loadingService.hideLoader(); // Ukrycie loadera po udanym logowaniu
          this.messageService.add({
            summary: this.headers['success'],
            detail: this.messages['loginSuccess'],
            severity: 'success',
            styleClass: 'p-toast',
          });
          
          // Ewentualne przekierowanie użytkownika po udanym logowaniu
          // this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.loadingService.hideLoader(); // Ukrycie loadera w przypadku błędu          
          this.errorHandlingService.displayNonCriticalError(this.headers['fail'], this.messages['loginError'])
        },
      });
    } else {
      this.loadingService.hideLoader(); // Ukrycie loadera, jeśli formularz jest niepoprawny
      this.errorHandlingService.displayNonCriticalError(this.headers['fail'], this.warnings['loginRequired'])
    }
  }
}
