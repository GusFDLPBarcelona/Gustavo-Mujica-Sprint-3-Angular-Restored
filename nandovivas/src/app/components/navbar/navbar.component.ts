import { Component, inject, OnInit, HostBinding } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { ContactComponent } from '../contact/contact.component';
import { CommonModule } from '@angular/common';
import { NavbarService } from '../../services/navbar.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, MatBottomSheetModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  @HostBinding('style.position') position = 'fixed';
  @HostBinding('style.top') top = '0';
  @HostBinding('style.left') left = '0';
  @HostBinding('style.right') right = '0';
  @HostBinding('style.zIndex') zIndex = '9999';

  isMenuVisible = false;
  private router = inject(Router);
  private bottomSheet = inject(MatBottomSheet);
  public navbarService = inject(NavbarService); // Hazlo público para el template

  ngOnInit(): void {
    console.log('🧭 NavbarComponent montado');
  }

  navigateHome(): void {
    console.log('NAVEGA A HOME');
    this.router.navigateByUrl('/', { skipLocationChange: false });
  }

  toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }

  navigateAndCloseMenu(): void {
    this.isMenuVisible = false;
  }

  openContactSheet(): void {
    this.bottomSheet.open(ContactComponent);
  }
}