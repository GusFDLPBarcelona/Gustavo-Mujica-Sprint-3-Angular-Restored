import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-email-modal',
  standalone: true,
  templateUrl: './email-modal.component.html',
  styleUrls: ['./email-modal.component.css'],
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatDialogModule]
})
export class EmailModalComponent {
  constructor(public dialogRef: MatDialogRef<EmailModalComponent>) {}

  closeModal(): void {
    this.dialogRef.close();
  }
}
