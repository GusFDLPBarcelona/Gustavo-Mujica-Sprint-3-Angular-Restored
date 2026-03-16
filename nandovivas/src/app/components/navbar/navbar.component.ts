import { Component, inject, OnInit, HostBinding, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
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
  private el = inject(ElementRef);
  public navbarService = inject(NavbarService); // Hazlo público para el template

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isMenuVisible && !this.el.nativeElement.contains(event.target)) {
      this.isMenuVisible = false;
    }
  }

  ngOnInit(): void {
  }

  navigateHome(): void {
    this.router.navigateByUrl('/', { skipLocationChange: false });
  }

  toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }

  navigateAndCloseMenu(): void {
    this.isMenuVisible = false;
  }

  openContactAndCloseMenu(): void {
    this.openContactSheet();
    this.navigateAndCloseMenu();
  }

  openContactSheet(): void {
    this.bottomSheet.open(ContactComponent);
  }
}