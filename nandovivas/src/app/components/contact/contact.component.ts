import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
})
export class ContactComponent implements OnInit {
  showEmailForm = false;
  showCookiesPolicy = false;
  emailForm!: FormGroup;
  state: 'form' | 'success' | 'error' = 'form';
  isMobile = window.innerWidth <= 767;

  constructor(
    private bottomSheet: MatBottomSheet,
    private fb: FormBuilder,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.checkViewport();
    this.emailForm = this.fb.group({
      fromEmail: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/)
        ]
      ],
      subject: ['', [Validators.required, Validators.maxLength(100)]],
      message: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.checkViewport();
  }

  private checkViewport() {
    this.isMobile = window.innerWidth <= 767;
  }

  closeContact(): void {
    // Si hay un overlay abierto, lo cerramos pero no cerramos el bottom sheet
    if (this.showEmailForm || this.showCookiesPolicy) {
      this.showEmailForm = false;
      this.showCookiesPolicy = false;
      this.state = 'form';
      this.emailForm.reset();
      this.emailForm.markAsPristine();
    } else {
      // Si no hay overlay, cerramos el bottom sheet
      this.bottomSheet.dismiss();
    }
  }

  // ===== MÉTODOS DE NAVEGACIÓN SIMPLIFICADOS =====
  openEmailModal(): void {
    // Cambio directo sin animaciones
    this.showEmailForm = true;
    this.showCookiesPolicy = false;
  }

  closeEmailForm(): void {
    this.showEmailForm = false;
    this.emailForm.reset();
    this.emailForm.markAsPristine();
  }

  openCookiesPolicy(): void {
    // Cambio directo sin animaciones
    this.showCookiesPolicy = true;
    this.showEmailForm = false;
  }

  closeCookiesPolicy(): void {
    this.showCookiesPolicy = false;
  }

  // ===== FORMULARIO SIMPLIFICADO =====
  sendEmail(): void {
    if (this.emailForm.valid) {
      try {
        this.toast.showSuccess('Message sent');
        this.state = 'success';
        setTimeout(() => {
          this.showEmailForm = false;
          this.state = 'form';
          this.emailForm.reset();
          this.emailForm.markAsPristine();
        }, 2000);
      } catch (error) {
        this.toast.showError('Error sending message');
        this.state = 'error';
      }
    } else {
      this.emailForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.closeEmailForm();
  }

  retry(): void {
    this.state = 'form';
    this.emailForm.reset();
  }

  // ===== UTILIDADES =====
  hasText(): boolean {
    return (
      this.emailForm.get('fromEmail')?.value?.trim() ||
      this.emailForm.get('subject')?.value?.trim() ||
      this.emailForm.get('message')?.value?.trim()
    );
  }

  get fromEmail() {
    return this.emailForm.get('fromEmail');
  }

  get subject() {
    return this.emailForm.get('subject');
  }

  get message() {
    return this.emailForm.get('message');
  }
}
