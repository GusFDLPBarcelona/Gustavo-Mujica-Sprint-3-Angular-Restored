import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { EmailModalComponent } from '../email-modal/email-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  imports: [
    CommonModule,
    MatButtonModule,
  ],
})
export class ContactComponent {
  constructor(private bottomSheet: MatBottomSheet) {}

  openEmailModal(): void {
    this.bottomSheet.open(EmailModalComponent);
  }
}
