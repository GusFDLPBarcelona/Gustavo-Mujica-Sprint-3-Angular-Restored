import { Component, inject, signal, computed } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'nandovivas';
  router = inject(Router);

  // Signal con la URL actual — se inicializa con la URL de entrada
  private currentUrl = signal(this.router.url);

  // La navbar del portfolio solo se muestra fuera del panel admin
  showNavbar = computed(() => !this.currentUrl().startsWith('/haupstadt'));

  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e) => {
      this.currentUrl.set((e as NavigationEnd).urlAfterRedirects);
    });
  }
}
