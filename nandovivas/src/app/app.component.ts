import { Component, inject } from '@angular/core';
import { Router, NavigationStart, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'nandovivas';
  showNavbar: boolean = true;
  router = inject(Router);

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        console.log('Navigating to:', event.url);
      }
    });
  }
}
