import { Component, inject } from '@angular/core';
import { ErrorHandlingService } from 'src/app/core/services/state/error-handling/error-handling.service';

@Component({
  selector: 'app-error-overlay',
  standalone: true,
  imports: [],
  templateUrl: './error-overlay.component.html',
  styleUrl: './error-overlay.component.scss'
})
export class ErrorOverlayComponent {
  private readonly errorHandlingService = inject(ErrorHandlingService)

    // Getter dla komunikatu i nagłówka błędu
    get errorMessage(): string {
      return this.errorHandlingService.getErrorMessage();
    }
  
    get errorHeader(): string {
      return this.errorHandlingService.getErrorHeader();
    }
}
