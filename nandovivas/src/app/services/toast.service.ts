import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
        duration: 5000, 
        panelClass: ['toast-success'], 
        horizontalPosition: 'center',
        verticalPosition: 'top',
    });
}

showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
        duration: 5000,
        panelClass: ['toast-error'],
        horizontalPosition: 'right',
        verticalPosition: 'top',
    });
}

showInfo(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
        duration: 5000,
        panelClass: ['toast-info'],
        horizontalPosition: 'left',
        verticalPosition: 'bottom',
    });
}

showCriticalError(message: string): void {
  this.snackBar.open(message, 'Cerrar', {
    duration: 4000, 
    panelClass: ['toast-error'], 
    horizontalPosition: 'center',
    verticalPosition: 'top',
  });
 }
}