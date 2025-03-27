import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, MatBottomSheetModule],
  templateUrl: './navbar.component.html', 
  styleUrls: ['./navbar.component.css'],
  standalone: true,
})
export class NavbarComponent {
  isMenuVisible = false;

  constructor(private bottomSheet: MatBottomSheet) {}

  toggleMenu() {
    console.log('isMenuVisible:', this.isMenuVisible); 
    this.isMenuVisible = !this.isMenuVisible;
  }

  navigateAndCloseMenu() {
    this.isMenuVisible = false;
  }

  openContactSheet(): void {
    this.bottomSheet.open(ContactComponent);
  }



}

