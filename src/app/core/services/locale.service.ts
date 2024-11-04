import { inject, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';
import { StrapiService } from './strapi.service';
import { forkJoin, map, Observable } from 'rxjs';
import { isPlatformServer } from '@angular/common';
import { IGroupedLocales, ILocaleCollection, ILocaleGroups, ILocaleItem, ILocalesResponse } from '../interfaces/i-locale';

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
  private readonly platformId = inject(PLATFORM_ID);
  private readonly acceptLanguage = inject(ACCEPT_LANGUAGE);

  private readonly defaultLocale: string = this.getDefaultLocale();

  private getDefaultLocale(): string {
    if (isPlatformServer(this.platformId) && this.acceptLanguage) {
      return this.acceptLanguage.startsWith('pl') ? 'pl-PL' : 'en';
    } else {
      const clientLanguage = navigator.language || 'en';
      return clientLanguage.startsWith('pl') ? 'pl-PL' : 'en';
    }
  }

  private getLocaleGroup(
    group: string,
    keys: string[],
    locale: string = this.defaultLocale
  ): Observable<ILocaleCollection> {
    const filters = [
      ...keys.map((key) => `filters[key][$eq]=${key}`),
      `filters[locale][$eq]=${locale}`,
    ].join('&');
    
    return this.strapiService.get(`${group}?${filters}`).pipe(
      map((response: any) => {
        return response.data.reduce(
          (acc: { [key: string]: string }, item: ILocaleItem) => {
            acc[item.key] = item.content;
            return acc;
          },
          {}
        );
      })
    );
  }

  getLocales(groups: ILocaleGroups): Observable<IGroupedLocales> {
    const requests = Object.keys(groups).map((group) =>
      this.getLocaleGroup(group, groups[group])
    );

    return forkJoin(requests).pipe(
      map((responses) => {        
        return Object.keys(groups).reduce((acc, group, index) => {
          acc[group] = responses[index];
          return acc;
        }, {} as ILocalesResponse);
      })
    );
  }
}
