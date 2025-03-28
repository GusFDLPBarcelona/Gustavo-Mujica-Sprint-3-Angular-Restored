import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

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
  ]
})

export class EmailModalComponent implements OnInit {
  emailForm!: FormGroup;
  state: 'form' | 'success' | 'error' = 'form';

  constructor(
    private fb: FormBuilder,
    private bottomSheetRef: MatBottomSheetRef<EmailModalComponent>,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      fromEmail: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
          )
        ]
      ],
      message: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }


  sendEmail(): void {
    if (this.emailForm.valid) {
      // Simulamos envío real — aquí va API call
      try {
        this.toast.showSuccess('Message sent');
        this.state = 'success';
      } catch (error) {
        this.toast.showError('Error sending message');
        this.state = 'error';
      }
    } else {
      this.emailForm.markAllAsTouched(); 
    }
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
}
