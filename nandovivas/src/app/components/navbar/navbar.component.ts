import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.component.html', // Ruta correcta
  styleUrls: ['./navbar.component.css'],
  standalone: true,
})
export class NavbarComponent {
  isMenuVisible = false;

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  navigateAndCloseMenu() {
    this.isMenuVisible = false;
  }
}

