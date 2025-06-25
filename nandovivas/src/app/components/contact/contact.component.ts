import { Component, signal } from '@angular/core';
import { EmailModalComponent } from '../email-modal/email-modal.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  imports: [
    MatButtonModule,
    EmailModalComponent,
  ],
})
export class ContactComponent {
  showForm = signal(false);

  openEmailForm() {
    this.showForm.set(true);
  }

  closeEmailForm() {
    this.showForm.set(false);
  }
}
// This component handles the contact section of the application.
// It allows users to open a modal form to send an email.