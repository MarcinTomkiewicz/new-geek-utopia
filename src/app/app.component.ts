import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from './components/sections/header/header.component';
import { SidebarComponent } from './components/sections/sidebar/sidebar.component';
import { FooterComponent } from './components/sections/footer/footer.component';
import { RightPanelComponent } from './components/sections/right-panel/right-panel.component';
import { ToastModule } from 'primeng/toast';
import { LoadingService } from './core/services/loading.service';
import { LoadingOverlayComponent } from './components/common/loading-overlay/loading-overlay.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ButtonModule, HeaderComponent, SidebarComponent, RightPanelComponent, FooterComponent, ToastModule, LoadingOverlayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
public readonly loadingService = inject(LoadingService);
private readonly cdr = inject(ChangeDetectorRef)

ngOnInit() {
    this.loadingService.loading$.subscribe(() => {
      this.cdr.markForCheck();
    });
}

ngAfterViewInit() {
  this.cdr.detectChanges();
}
}
