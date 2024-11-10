import { Injectable, inject } from '@angular/core';
import { StrapiService } from '../../http/strapi/strapi.service';
import { LocaleService } from '../../state/locale/locale.service';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { IMenuItems } from '../../../interfaces/i-menu-item';
import { LoadingService } from '../../state/loading/loading.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly strapiService = inject(StrapiService);
  private readonly localeService = inject(LocaleService);
  private readonly loadingService = inject(LoadingService);

  getMenuItems(menuType: string): Observable<IMenuItems[]> {
    const locale = this.localeService.getDefaultLocale();
    this.loadingService.showLoader();
    return this.strapiService
      .get<any>(
        `menu-items?populate[0]=children&populate[1]=parent&filters[locale][$eq]=${locale}&filters[type][$eq]=${menuType}&sort=order`
      )
      .pipe(
        map((response: any) => this.mapMenuItems(response.data)),
        finalize(() => this.loadingService.hideLoader())
      );
  }

  private mapMenuItems(items: any[]): IMenuItems[] {
    return items
      .filter((item) => !item.parent) 
      .map((item) => {
        const children = item.children && item.children.length > 0 ? this.mapMenuItems(item.children) : [];
        return {
          label: item.label,
          icon: item.icon,
          items: children,
        };
      });
  }
}
