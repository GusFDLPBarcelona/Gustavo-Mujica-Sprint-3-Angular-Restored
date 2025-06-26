import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string): void {
    const ref = this.snackBar.open(message, '✖', {
      duration: 3000,
      panelClass: 'custom-toast',
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });

    ref.onAction().subscribe(() => {
    console.log('Toast cerrado manualmente');
    ref.dismiss();
  });
  }

  showError(message: string): void {
    const ref = this.snackBar.open(message, '✖', {
      duration: 3000,
      panelClass: 'custom-toast',
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });

    ref.onAction().subscribe(() => {
    console.log('Toast cerrado manualmente');
    ref.dismiss();
   });
  }

showInfo(message: string): void {
    const ref = this.snackBar.open(message, '✖', {
        duration: 5000,
        panelClass: ['toast-info'],
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
    });

    ref.onAction().subscribe(() => {
    console.log('Toast cerrado manualmente');
    ref.dismiss();
  });
}

showCriticalError(message: string): void {
  const ref = this.snackBar.open(message, '✖', {
    duration: 4000, 
    panelClass: ['toast-error'], 
    horizontalPosition: 'center',
    verticalPosition: 'top',
  });
  
    ref.onAction().subscribe(() => {
    console.log('Toast cerrado manualmente');
    ref.dismiss();
  });
 }
}