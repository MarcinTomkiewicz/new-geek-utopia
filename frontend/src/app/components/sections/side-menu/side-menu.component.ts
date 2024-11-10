import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IMenuItems } from 'src/app/core/interfaces/i-menu-item';
import { MenuService } from 'src/app/core/services/content/menu/menu.service';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { ErrorHandlingService } from 'src/app/core/services/state/error-handling/error-handling.service';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule, PanelMenuModule, CardModule, BadgeModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {
  private readonly menuService = inject(MenuService);
  private readonly errorHandlingService = inject(ErrorHandlingService);
  menuItems!: IMenuItems[];

  ngOnInit() {
    this.menuService.getMenuItems('main').subscribe({
      next: (items) => {
        this.menuItems = items;
      },
      error: (err) => {
        this.errorHandlingService.displayNonCriticalError('Error', err);
      }
    });
  }
}
