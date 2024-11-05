import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private activeRequests = 0;
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  // Wywoływane na początku ładowania dowolnego komponentu
  showLoader() {
    this.activeRequests++;
    this.updateLoadingState();
  }

  // Wywoływane po zakończeniu ładowania dowolnego komponentu
  hideLoader() {
    if (this.activeRequests > 0) {
      this.activeRequests--;
      this.updateLoadingState();
    }
  }

  // Aktualizuje stan loadera; pokaż, jeśli aktywne żądania > 0
  private updateLoadingState() {
    this.loadingSubject.next(this.activeRequests > 0);
  }
}