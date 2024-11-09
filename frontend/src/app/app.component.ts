import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from './components/sections/header/header.component';
import { SidebarComponent } from './components/sections/sidebar/sidebar.component';
import { FooterComponent } from './components/sections/footer/footer.component';
import { RightPanelComponent } from './components/sections/right-panel/right-panel.component';
import { ToastModule } from 'primeng/toast';
import { LoadingService } from './core/services/state/loading/loading.service';
import { LoadingOverlayComponent } from './shared/components/loading-overlay/loading-overlay.component';
import { CommonModule } from '@angular/common';
import { ErrorOverlayComponent } from './shared/components/error-overlay/error-overlay.component';
import { ErrorHandlingService } from './core/services/state/error-handling/error-handling.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ButtonModule,
    HeaderComponent,
    SidebarComponent,
    RightPanelComponent,
    FooterComponent,
    ToastModule,
    LoadingOverlayComponent,
    ErrorOverlayComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public readonly loadingService = inject(LoadingService);
  public readonly errorHandlingService = inject(ErrorHandlingService);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadingService.loading$.subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
}
