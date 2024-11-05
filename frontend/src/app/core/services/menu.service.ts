import { Injectable, inject } from '@angular/core';
import { StrapiService } from './strapi.service';
import { LocaleService } from './locale.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IMenuItems } from '../interfaces/i-menu-item';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly strapiService = inject(StrapiService);
  private readonly localeService = inject(LocaleService);

  getMenuItems(): Observable<IMenuItems[]> {
    const locale = this.localeService.getDefaultLocale();

    return this.strapiService
      .get<any>(`menu-items?populate[0]=children&populate[1]=parent&filters[locale][$eq]=${locale}&sort=order`)
      .pipe(
        map((response: any) => {
          return this.mapMenuItems(response.data);
        })
      );
  }

  private mapMenuItems(items: any[]): IMenuItems[] {
    return items
      .filter(item => !item.parent)
      .map((item) => {
        console.log(item);
        
        const children = item.children || [];
        return {
          label: item.label,
          icon: item.icon,
          items: this.mapMenuItems(children),
        };
      });
  }
}