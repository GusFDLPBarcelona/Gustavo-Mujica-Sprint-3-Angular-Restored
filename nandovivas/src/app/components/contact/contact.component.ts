import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatBottomSheetRef, MatBottomSheetModule } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  imports: [
    MatBottomSheetModule,
    MatButtonModule,
    MatDividerModule,
    MatCardModule
  ]
})
export class ContactComponent {
  constructor(private bottomSheetRef: MatBottomSheetRef<ContactComponent>) {}

  close(): void {
    this.bottomSheetRef.dismiss();
  }

  openEmailModal(): void {
    window.location.href = 'mailto:info@nandovivas.com';
  }
}
