import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/http/auth/auth.service';
import { MenuModule } from 'primeng/menu';
import { MenuService } from 'src/app/core/services/content/menu/menu.service';
import { IMenuItems } from 'src/app/core/interfaces/i-menu-item';
import { DividerModule } from 'primeng/divider';
import { forkJoin } from 'rxjs';
import { ErrorHandlingService } from 'src/app/core/services/state/error-handling/error-handling.service';
import { ILocaleCollection } from 'src/app/core/interfaces/i-locale';
import { LocaleService } from 'src/app/core/services/state/locale/locale.service';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule, MenuModule, PanelMenuModule, DividerModule, ButtonModule],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss',
})
export class UserMenuComponent {
  private readonly authService = inject(AuthService);
  private readonly menuService = inject(MenuService);
  private readonly localeService = inject(LocaleService);
  private readonly errorHandlingService = inject(ErrorHandlingService);
  isAdmin = true;
  menuItems: IMenuItems[] = [];
  adminMenuItems: IMenuItems[] = [];
  button: ILocaleCollection = {};

  ngOnInit() {
    const requestedLocales = { buttons: ['logout'] };
    forkJoin({
      userMenu: this.menuService.getMenuItems('user'),
      adminMenu: this.menuService.getMenuItems('admin'),
      button: this.localeService.getLocales(requestedLocales),
    }).subscribe({
      next: ({ userMenu, adminMenu, button }) => {
        this.menuItems = userMenu
        this.adminMenuItems = adminMenu;
        this.button = button['logout'] || {};
      },
      error: (err) => {
        this.errorHandlingService.displayNonCriticalError(err.name, err.message);
      },
    });
  }

  logout(): void {
    this.authService.logout();
    // Możesz dodać dodatkowe akcje po wylogowaniu, np. przekierowanie
  }
}
