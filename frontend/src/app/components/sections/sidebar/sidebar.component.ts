import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, inject, input, Type } from '@angular/core';
import { SidebarService } from 'src/app/core/services/content/sidebar/sidebar.service';
import { LoadingService } from 'src/app/core/services/state/loading/loading.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgComponentOutlet, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private readonly sidebarService = inject(SidebarService);
  private readonly loadingService = inject(LoadingService);
  readonly side = input<'left' | 'right'>('left');
  public sidebarComponents: Type<any>[] = [];

  ngOnInit() {
    this.loadingService.showLoader();

    this.sidebarService
      .getSidebarContent(this.side())
      .subscribe({
        next: (components) => {
          this.sidebarComponents = components;
          this.loadingService.hideLoader();
        },
        error: (err) => {
          console.error('Error loading sidebar components', err);
          this.loadingService.hideLoader();
        },
      });
  }
}
