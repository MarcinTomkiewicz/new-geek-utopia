import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, inject, input, Type } from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading.service';
import { SidebarService } from 'src/app/core/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgComponentOutlet, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private readonly sidebarService = inject(SidebarService)
  private readonly loadingService = inject(LoadingService)
  readonly side = input<'left' | 'right'>('left');
  public sidebarComponents: Type<any>[] = [];

  ngOnInit() {
    this.loadingService.showLoader()
    this.sidebarService.getSidebarContent(this.side()).subscribe({
      next: (components) => {
        this.sidebarComponents = components
        this.loadingService.hideLoader()
      },
      error: () => this.loadingService.hideLoader(),
      complete: () => this.loadingService.hideLoader(),
    });
  }
}
