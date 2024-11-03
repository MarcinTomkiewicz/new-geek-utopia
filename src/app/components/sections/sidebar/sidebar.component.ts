import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, inject, input, Type } from '@angular/core';
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
  readonly side = input<'left' | 'right'>('left');
  public sidebarComponents: Type<any>[] = [];

  ngOnInit() {
    this.sidebarService.getSidebarContent(this.side()).subscribe(components => {
      this.sidebarComponents = components;
    });
  }
}
