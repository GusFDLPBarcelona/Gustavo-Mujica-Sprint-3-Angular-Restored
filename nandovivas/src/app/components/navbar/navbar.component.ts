import { Component, inject, OnInit, HostBinding } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { ContactComponent } from '../contact/contact.component';
import { CommonModule } from '@angular/common';
import { NavbarService } from '../../services/navbar.service'; // 👈 Asegurate que esté bien la ruta

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, MatBottomSheetModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  navigateHome(): void {
    console.log('JODER NO SE SI NAVEGA A HOME O NO');
    this.navbarService.setShowNavbar(true); // por si acaso
    this.router.navigateByUrl('/', { skipLocationChange: false });
  }

  @HostBinding('style.position') position = 'fixed';
  @HostBinding('style.top') top = '0';
  @HostBinding('style.left') left = '0';
  @HostBinding('style.right') right = '0';
  @HostBinding('style.zIndex') zIndex = '9999';
  isMenuVisible = false;
  private router = inject(Router);
  private bottomSheet = inject(MatBottomSheet);
  navbarService = inject(NavbarService);
  
  ngOnInit(): void {
    console.log('🧭 NavbarComponent montado');
    // Mostrar la navbar al iniciar (por si entramos directo a /)
    const initialUrl = this.router.url;
    const isWorkRoute = initialUrl.includes('/work');
    if (!isWorkRoute) {
      this.navbarService.setShowNavbar(true);
    }
  
    // Luego seguimos escuchando cambios de ruta
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const isWork = event.urlAfterRedirects.includes('/work');
        if (!isWork) {
          this.navbarService.setShowNavbar(true);
        }
      }
    });
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
