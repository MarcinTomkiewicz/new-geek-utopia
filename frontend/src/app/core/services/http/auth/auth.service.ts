import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
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
          this.tokenService.setToken(response.jwt); // Użyj TokenService
        })
      );
  }

  // Rejestracja użytkownika
  register(
    username: string,
    email: string,
    password: string,
    name: string
  ): Observable<AuthResponse> {
    const registerData = { username, email, password };
    console.log(username, email, password, name);

    return this.strapiService
      .post<AuthResponse>(`${this.baseUrl}/local/register`, registerData)
      .pipe(
        switchMap((userResponse: any) => {
          // Drugi krok: Utwórz rekord w tabeli 'user-data' z polem 'name' i powiąż go z utworzonym użytkownikiem
          const userId = userResponse.user.id;
          const usersData = { data: { name: name, user: userId } };
          console.log(usersData );

          return this.strapiService.post<AuthResponse>(`users-data`, usersData);
        })
      );
  }

  // Wylogowanie użytkownika
  logout(): void {
    this.tokenService.removeToken(); // Użyj TokenService
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
