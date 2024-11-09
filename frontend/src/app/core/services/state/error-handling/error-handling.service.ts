import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  private readonly messageService = inject(MessageService);
  private readonly errorSubject = new BehaviorSubject<boolean>(false);
  error$: Observable<boolean> = this.errorSubject.asObservable();

  private error403Count = 0; // Licznik błędów 403
  private criticalErrorDisplayed = false; // Flaga, czy krytyczny błąd został już wyświetlony
  private pendingRequests = 0; // Liczba aktywnych żądań (żeby wiedzieć, kiedy wszystkie się zakończą)
  private errorMessage: string = ''; // Przechowuje wiadomość o błędzie
  private errorHeader: string = ''; // Przechowuje nagłówek błędu

  // Obsługuje wyświetlanie krytycznego błędu
  displayCriticalError(errorMessage: string = 'Service Unavailable', errorHeader: string = 'Service Unavailable') {
    if (!this.criticalErrorDisplayed) {
      this.criticalErrorDisplayed = true;
      this.errorMessage = errorMessage;  // Przypisujemy wiadomość
      this.errorHeader = errorHeader;    // Przypisujemy nagłówek
      this.errorSubject.next(true); // Pokazuje pełnoekranowy overlay
    }
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }

  // Getter dla nagłówka błędu
  getErrorHeader(): string {
    return this.errorHeader;
  }

  // Obsługuje ukrycie krytycznego błędu
  hideCriticalError() {
    this.criticalErrorDisplayed = false;
    this.errorSubject.next(false); // Ukrywa overlay
  }

  // Obsługuje błędy niekrytyczne - wyświetlanie komunikatu lub toastu
  displayNonCriticalError(errorHeader: string = 'Warning', errorMessage: string = 'Some content failed to load. Try again later.') {
    this.messageService.add({
      severity: 'warn',
      summary: errorHeader,
      detail: errorMessage,
    });
  }

  // Zlicza błędy 403
  incrementErrorCount() {
    this.error403Count++;
  }

  // Resetuje licznik błędów 403
  resetErrorCount() {
    this.error403Count = 0;
  }

  // Obsługuje błąd 403 - w zależności od liczby
  handle403Error() {
    this.incrementErrorCount();

    // Jeśli liczba błędów 403 przekroczy 3, wyświetl krytyczny błąd
    if (this.error403Count >= 3) {
      this.displayCriticalError(
        'Multiple 403 Errors',
        'You have been denied access to several resources. Please refresh the page or contact support.'
      );
    }
  }

  // Śledzenie zakończenia żądania - po zakończeniu wszystkich aktywnych żądań, sprawdzenie liczby błędów
  trackPendingRequests() {
    this.pendingRequests++;

    // Po zakończeniu wszystkich żądań sprawdź liczbę błędów 403
    if (this.pendingRequests === 0) {
      if (this.error403Count > 0 && this.error403Count < 3) {
        this.displayNonCriticalError(
          'Access Denied',
          `There were ${this.error403Count} attempts to access restricted resources.`
        );
      }
    }
  }

  // Zmniejsz liczbę aktywnych żądań po ich zakończeniu
  decrementPendingRequests() {
    this.pendingRequests--;
  }

  // Resetowanie liczby błędów 403 po poprawnym załadowaniu danych
  reset403ErrorCount() {
    this.resetErrorCount();
  }

  // Powiadomienie o błędzie 403 tylko wtedy, gdy liczba błędów osiągnie odpowiedni próg
  shouldDisplay403Error() {
    return this.error403Count < 3;
  }
}
