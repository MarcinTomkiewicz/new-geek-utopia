import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private token: string | null = null;
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  setToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem('jwt', token);
    } else {
      this.token = token; // Użyj zmiennej lokalnej po stronie serwera
    }
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem('jwt') : this.token;
  }

  removeToken(): void {
    if (this.isBrowser) {
      localStorage.removeItem('jwt');
    } else {
      this.token = null;
    }
  }
}