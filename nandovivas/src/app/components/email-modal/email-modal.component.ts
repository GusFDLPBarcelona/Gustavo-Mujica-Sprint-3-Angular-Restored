import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ContactComponent } from '../contact/contact.component';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-email-modal',
  standalone: true,
  templateUrl: './email-modal.component.html',
  styleUrls: ['./email-modal.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatBottomSheetModule
  ],
  animations: [
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class EmailModalComponent implements OnInit {
  private toast = inject(ToastService); // Inyección moderna
  emailForm!: FormGroup;
  state: 'form' | 'success' | 'error' = 'form';

  constructor(
    private fb: FormBuilder,
    private bottomSheetRef: MatBottomSheetRef<EmailModalComponent>,
    private bottomSheet: MatBottomSheet
  ) {
    this.bottomSheetRef.disableClose = true;
  }

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      fromEmail: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/)
        ]
      ],
      message: ['', [Validators.required, Validators.maxLength(500)]]
    });

    this.bottomSheetRef.backdropClick().subscribe(() => {
      this.handleCloseAttempt();
    });
  }

  private handleCloseAttempt(): void {
    if (this.hasText()) {
      this.toast.showError('You have unsaved text. Please save or cancel before closing.');
      return;
    }
    this.closeAndOpenContact();
  }

  hasText(): boolean {
    return (
      this.emailForm.get('fromEmail')?.value?.trim() ||
      this.emailForm.get('message')?.value?.trim()
    );
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEsc(event: KeyboardEvent): void {
    this.handleCloseAttempt();
    event.preventDefault();
  }

  sendEmail(): void {
    if (this.emailForm.valid) {
      try {
        this.toast.showSuccess('Message sent');
        this.state = 'success';
        
        // Nueva implementación sin then()
        setTimeout(() => {
          this.bottomSheetRef.dismiss();
          setTimeout(() => {
            this.showContactSheet();
          }, 350); // Espera que termine la animación de cierre
        }, 2000);
      } catch (error) {
        this.toast.showError('Error sending message');
        this.state = 'error';
      }
    } else {
      this.emailForm.markAllAsTouched();
    }
  }

  private showContactSheet(): void {
    this.bottomSheet.open(ContactComponent, {
      panelClass: 'contact-bottom-sheet',
      ariaLabel: 'Contact options'
    });
  }

  private closeAndOpenContact(): void {
    this.bottomSheetRef.dismiss();
    setTimeout(() => {
      this.showContactSheet();
    }, 350); // Espera que termine la animación de cierre
  }

  get fromEmail() {
    return this.emailForm.get('fromEmail');
  }

  get message() {
    return this.emailForm.get('message');
  }

  retry(): void {
    this.state = 'form';
    this.emailForm.reset();
  }

  close(): void {
    this.bottomSheetRef.dismiss();
  }

  backToContact(): void {
    if (!this.hasText()) {
      this.closeAndOpenContact();
    } else {
      this.toast.showError('You have unsaved text. Please save or cancel before going back.');
    }
  }

  cancel(): void {
    this.emailForm.reset();
  }
}