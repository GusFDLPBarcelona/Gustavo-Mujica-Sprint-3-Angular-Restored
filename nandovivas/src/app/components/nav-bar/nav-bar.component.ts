import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
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
