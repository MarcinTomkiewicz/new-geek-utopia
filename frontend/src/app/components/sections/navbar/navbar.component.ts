import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { IMenuItems } from 'src/app/core/interfaces/i-menu-item';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { MenuService } from 'src/app/core/services/menu.service';
import { LoadingService } from 'src/app/core/services/loading.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MenubarModule,
    CommonModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly menuService = inject(MenuService);
  private readonly loadingService = inject(LoadingService);
  menuItems!: IMenuItems[];
  items: IMenuItems[];

  constructor() {
    this.items = [
      {
        label: 'Strona Główna',
        icon: 'pi pi-fw pi-home',
      },
      {
        label: 'Kategorie',
        icon: 'pi pi-fw pi-bars',
        children: [
          {
            label: 'MCU',
            icon: 'pi pi-fw pi-star',
          },
          {
            label: 'DCEU',
            icon: 'pi pi-fw pi-star',
          },
          {
            label: 'Marvel Comics',
            icon: 'pi pi-fw pi-book',
          },
          {
            label: 'DC Comics',
            icon: 'pi pi-fw pi-book',
          },
        ],
      },
      {
        label: 'Newsy',
        icon: 'pi pi-fw pi-bell',
      },
      {
        label: 'O nas',
        icon: 'pi pi-fw pi-bolt',
      },
    ];
  }

  ngOnInit() {
    this.loadingService.showLoader();
    this.menuService.getMenuItems().subscribe({
      next: (items) => {
        this.menuItems = items;
        this.loadingService.hideLoader();
      },
      error: (err) => {
        console.error('Error loading menu items', err);
        this.loadingService.hideLoader();
      },
    });
  }
}
