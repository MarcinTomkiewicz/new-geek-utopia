import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from './components/sections/header/header.component';
import { SidebarComponent } from './components/sections/sidebar/sidebar.component';
import { FooterComponent } from './components/sections/footer/footer.component';
import { RightPanelComponent } from './components/sections/right-panel/right-panel.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, HeaderComponent, SidebarComponent, RightPanelComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'geek-utopia';
}
