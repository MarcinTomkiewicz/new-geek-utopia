import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, Button, InputTextModule, PasswordModule, ReactiveFormsModule, CardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  showRegister: boolean = false;
  private readonly cdr = inject(ChangeDetectorRef)

  constructor(private readonly fb: FormBuilder, private readonly messageService: MessageService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      regUsername: ['', Validators.required],
      regPassword: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Test logowania pomyślny' });
    }
  }

  toggleRegister() {
    this.showRegister = !this.showRegister;
    this.cdr.detectChanges();

    if (this.showRegister) {
        this.registerForm.reset();
    } else {
        this.loginForm.reset();
    }
}

  register() {
    // Tutaj możesz dodać logikę rejestracji
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Test rejestracji pomyślny' });
  }
}
