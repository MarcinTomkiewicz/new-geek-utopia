import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { LocaleService } from 'src/app/core/services/state/locale/locale.service';
import { ILocaleCollection } from 'src/app/core/interfaces/i-locale';
import { LoadingService } from 'src/app/core/services/state/loading/loading.service';
import { LoginFormComponent } from 'src/app/shared/components/login-form/login-form.component';
import { RegistrationFormComponent } from 'src/app/shared/components/registration-form/registration-form.component';

@Component({
  selector: 'app-user-side-panel',
  standalone: true,
  imports: [
    CommonModule,
    LoginFormComponent,
    RegistrationFormComponent,
    ButtonModule,
    CardModule,
  ],
  templateUrl: './user-side-panel.component.html',
  styleUrl: './user-side-panel.component.scss',
})
export class UserSidePanelComponent {
  showRegister: boolean = false;
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly localeService = inject(LocaleService);

  headers: ILocaleCollection = {};
  messages: ILocaleCollection = {};

  ngOnInit() {
    const requestedLocales = {
      headers: ['login', 'register'],
      messages: ['noAccount', 'haveAccount'],
    };

    this.localeService.getLocales(requestedLocales).subscribe({
      next: (locales) => {
        this.headers = locales['headers'] || {};
        this.messages = locales['messages'] || {};
      },
      error: (error) => {
        console.error(error)
      },
    });
  }

  toggleRegister() {
    this.showRegister = !this.showRegister;
    this.cdr.detectChanges();
  }
}