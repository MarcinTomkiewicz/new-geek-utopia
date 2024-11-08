import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StrapiService } from '../strapi/strapi.service';
import { TokenService } from '../token/token.service';

interface AuthResponse {
  jwt: string;
  user: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'auth';
  private readonly strapiService = inject(StrapiService);
  private readonly tokenService = inject(TokenService);

  // Logowanie użytkownika
  login(identifier: string, password: string): Observable<AuthResponse> {
    return this.strapiService
      .post<AuthResponse>(`${this.baseUrl}/local`, { identifier, password })
      .pipe(
        tap((response) => {
          this.tokenService.setToken(response.jwt);  // Użyj TokenService
        })
      );
  }

  // Rejestracja użytkownika
  register(username: string, email: string, password: string, name: string): Observable<AuthResponse> {
    return this.strapiService
      .post<AuthResponse>(`${this.baseUrl}/local/register`, { username, email, password, name })
      .pipe(
        tap((response) => {
          this.tokenService.setToken(response.jwt);  // Użyj TokenService
        })
      );
  }

  // Wylogowanie użytkownika
  logout(): void {
    this.tokenService.removeToken();  // Użyj TokenService
  }

  // Metoda pomocnicza do sprawdzania, czy użytkownik jest zalogowany
  isAuthenticated(): boolean {
    return !!this.tokenService.getToken();
  }

  // Metoda pomocnicza do pobierania tokenu JWT
  getToken(): string | null {
    return this.tokenService.getToken();
  }
}