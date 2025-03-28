import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatBottomSheet, MatBottomSheetRef, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { EmailModalComponent } from '../email-modal/email-modal.component';

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
  constructor(
    private bottomSheetRef: MatBottomSheetRef<ContactComponent>,
    private bottomSheet: MatBottomSheet
  ) {}

  close(): void {
    this.bottomSheetRef.dismiss();
  }

  openEmailForm(): void {
    const ref = this.bottomSheet.open(EmailModalComponent);
  
    ref.afterDismissed().subscribe(() => {
      this.bottomSheet.open(ContactComponent);
    });
  }

  openEmailToJMG(): void {
    const ref = this.bottomSheet.open(EmailModalComponent, {
      data: { toEmail: 'gustavoejmg@gmail.com' }
    });
  
    ref.afterDismissed().subscribe(() => {
      this.bottomSheet.open(ContactComponent);
    });
  }
}
