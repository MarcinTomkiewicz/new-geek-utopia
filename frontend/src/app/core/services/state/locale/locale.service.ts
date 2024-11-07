import { inject, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';
import { StrapiService } from '../../http/strapi/strapi.service';
import { finalize, forkJoin, map, Observable } from 'rxjs';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { IGroupedLocales, ILocaleCollection, ILocaleGroups, ILocaleItem, ILocalesResponse } from '../../../interfaces/i-locale';
import { LoadingService } from '../loading/loading.service';

export const ACCEPT_LANGUAGE = new InjectionToken<string | null>(
  'accept-language',
  {
    providedIn: 'root',
    factory: () => null,
  }
);

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  private readonly strapiService = inject(StrapiService);
  private readonly loadingService = inject(LoadingService)
  private readonly platformId = inject(PLATFORM_ID);
  private readonly acceptLanguage = inject(ACCEPT_LANGUAGE);

  private readonly defaultLocale: string = this.getDefaultLocale();

public getDefaultLocale(): string {
    // Sprawdzenie, czy środowisko to przeglądarka
    if (isPlatformBrowser(this.platformId)) {
      const clientLanguage = navigator.language || 'en';
      return clientLanguage.startsWith('pl') ? 'pl-PL' : 'en';
    } 
    // Środowisko serwera - używamy `acceptLanguage` lub domyślnej wartości
    else if (this.acceptLanguage) {
      return this.acceptLanguage.startsWith('pl') ? 'pl-PL' : 'en';
    } else {
      return 'en';  // Domyślna wartość dla środowiska serwera
    }
  }

  private getLocaleGroup(
    group: string,
    keys: string[],
    fromWhere: string,
    locale: string = this.defaultLocale,
  ): Observable<ILocaleCollection> {
    const filters = [
      ...keys.map((key) => `filters[key][$eq]=${key}`),
      `filters[locale][$eq]=${locale}`,
    ].join('&');
    
    this.loadingService.showLoader();
    
    return this.strapiService.get(`${group}?${filters}`).pipe(
      map((response: any) => {
        return response.data.reduce(
          (acc: { [key: string]: string }, item: ILocaleItem) => {
            acc[item.key] = item.content;
            return acc;
          },
          {}
        );
      }),
      finalize(() => this.loadingService.hideLoader())
    );
  }

  getLocales(groups: ILocaleGroups, fromWhere: string): Observable<IGroupedLocales> {
    const requests = Object.keys(groups).map((group) =>
      this.getLocaleGroup(group, groups[group], fromWhere)
    );
  
    // Pokazanie loadera na początku metody
    this.loadingService.showLoader();
  
    return forkJoin(requests).pipe(
      map((responses) => {        
        return Object.keys(groups).reduce((acc, group, index) => {
          acc[group] = responses[index];
          return acc;
        }, {} as ILocalesResponse);
      }),
      // Ukrycie loadera po zakończeniu wszystkich żądań
      finalize(() => this.loadingService.hideLoader())
    );
  }
}
