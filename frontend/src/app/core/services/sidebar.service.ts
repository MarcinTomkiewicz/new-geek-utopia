import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { InstaFeedComponent } from 'src/app/components/sections/insta-feed/insta-feed.component';
import { LoginComponent } from 'src/app/components/sections/login/login.component';
import { SideMenuComponent } from 'src/app/components/sections/side-menu/side-menu.component';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  // BehaviorSubject dla komponentów lewego i prawego sidebara
  private readonly leftSidebarComponents = new BehaviorSubject<any[]>([
    LoginComponent,
    SideMenuComponent
  ]);

  private readonly  rightSidebarComponents = new BehaviorSubject<any[]>([
    InstaFeedComponent
  ]);

  // Metoda do pobierania odpowiedniego strumienia w zależności od parametru side
  getSidebarContent(side: 'left' | 'right'): Observable<any[]> {
    return side === 'left' 
      ? this.leftSidebarComponents.asObservable()
      : this.rightSidebarComponents.asObservable();
  }

  // Dodatkowe metody do dynamicznego zarządzania zawartością (opcjonalnie)
  addToSidebar(side: 'left' | 'right', component: any) {
    const currentComponents = side === 'left' 
      ? this.leftSidebarComponents.getValue()
      : this.rightSidebarComponents.getValue();
      
    if (side === 'left') {
      this.leftSidebarComponents.next([...currentComponents, component]);
    } else {
      this.rightSidebarComponents.next([...currentComponents, component]);
    }
  }

  removeFromSidebar(side: 'left' | 'right', component: any) {
    const currentComponents = side === 'left' 
      ? this.leftSidebarComponents.getValue().filter(c => c !== component)
      : this.rightSidebarComponents.getValue().filter(c => c !== component);

    if (side === 'left') {
      this.leftSidebarComponents.next(currentComponents);
    } else {
      this.rightSidebarComponents.next(currentComponents);
    }
  }
}