import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ErrorHandlingService } from '../../../services/state/error-handling/error-handling.service';
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const errorHandlingService = inject(ErrorHandlingService);
  const platformId = inject(PLATFORM_ID);

  // Zwiększamy liczbę oczekujących żądań
  errorHandlingService.trackPendingRequests();

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Sprawdzamy, czy aplikacja działa po stronie klienta
      if (isPlatformBrowser(platformId)) {
        // Obsługuje błąd 403 (dostęp zabroniony)
        if (error.status === 403) {
          errorHandlingService.handle403Error(); // Zliczamy błąd 403
        } 
        // Obsługuje krytyczne błędy (np. brak połączenia z internetem lub błąd serwera)
        else if (!navigator.onLine || error.status >= 500) {
          errorHandlingService.displayCriticalError( 
            'Service Unavailable',
            'Our servers are currently unreachable. Please try again later.'
          );
        } 
        // Obsługuje inne błędy niekrytyczne
        else {
          errorHandlingService.displayNonCriticalError(
            'Something went wrong',
            'There was an issue with loading the content. Please try again later.'
          );
        }
      }
      
      // Zmniejszamy liczbę aktywnych żądań
      errorHandlingService.decrementPendingRequests();
      return throwError(() => error); // Zwraca błąd, aby był dostępny w konsoli
    })
  );
};
