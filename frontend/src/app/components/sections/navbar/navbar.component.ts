import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { IMenuItems } from 'src/app/core/interfaces/i-menu-item';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { MenuService } from 'src/app/core/services/content/menu/menu.service';
import { LoadingService } from 'src/app/core/services/state/loading/loading.service';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { LocaleService } from 'src/app/core/services/state/locale/locale.service';
import { ILocaleCollection } from 'src/app/core/interfaces/i-locale';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { LoginFormComponent } from 'src/app/shared/components/login-form/login-form.component';
import { AuthService } from 'src/app/core/services/http/auth/auth.service';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { ErrorHandlingService } from 'src/app/core/services/state/error-handling/error-handling.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MenubarModule,
    CommonModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    InputIconModule,
    IconFieldModule,
    OverlayPanelModule,
    LoginFormComponent,
    UserMenuComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly menuService = inject(MenuService);
  private readonly localeService = inject(LocaleService)
  public readonly authService = inject(AuthService)
  private readonly errorHandlingService = inject(ErrorHandlingService);
  menuItems!: IMenuItems[];
  locale: ILocaleCollection = {};

    ngOnInit() {
    
      const requestedLocales = {labels: ['search']}
      this.menuService.getMenuItems('main').subscribe({
        next: (items) => {
          this.menuItems = items;
        },
        error: (err) => {
          this.errorHandlingService.displayNonCriticalError('Error', err);
        }
      });
      this.localeService.getLocales(requestedLocales).subscribe({
        next: (locales) => {
          this.locale = locales['labels'] || {}
        }
      })
    }
}
