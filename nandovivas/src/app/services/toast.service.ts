import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) { }

  showSuccess(message: string): void {
    const ref = this.snackBar.open(message, '✖', {
      duration: 3000,
      panelClass: ['toast-success'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });

    ref.onAction().subscribe(() => {
      ref.dismiss();
    });
  }

  showWarning(message: string, config?: { action?: string, onAction?: () => void, onCancel?: () => void }): MatSnackBarRef<any> {
  // HTML personalizado para el toast modal
  const toastElement = document.createElement('div');
  toastElement.className = 'toast-modal-content';
  toastElement.innerHTML = `
    <div class="toast-message">${message}</div>
    <div class="toast-buttons">
      <button type="button" class="btn-keep-editing">Keep Editing</button>
      <button type="button" class="btn-cancel-anyway primary">Cancel Anyway</button>
    </div>
  `;

  // Deshabilitar el backdrop del bottom sheet antes de mostrar el toast
  this.disableBottomSheetBackdrop();
  
  // AGREGAR: Crear blocker de clicks
  this.addClickBlocker();

  const ref = this.snackBar.open('', '', {
    duration: 0, // No se cierra automáticamente
    panelClass: ['toast-warning', 'toast-modal'],
    horizontalPosition: 'center',
    verticalPosition: 'top',
    data: { customElement: toastElement }
  });

  // Reemplazar el contenido del snackbar con nuestro HTML personalizado
  setTimeout(() => {
    const snackBarContainer = document.querySelector('.mat-mdc-snack-bar-container.toast-modal');
    if (snackBarContainer) {
      // Limpiar contenido existente
      snackBarContainer.innerHTML = '';
      snackBarContainer.appendChild(toastElement);

      // Agregar event listeners a los botones
      const keepBtn = snackBarContainer.querySelector('.btn-keep-editing') as HTMLButtonElement;
      const cancelBtn = snackBarContainer.querySelector('.btn-cancel-anyway') as HTMLButtonElement;

      if (keepBtn) {
        keepBtn.addEventListener('click', () => {
          if (config?.onCancel) {
            config.onCancel();
          }
          this.enableBottomSheetBackdrop(); // Rehabilitar backdrop
          this.removeClickBlocker(); // AGREGAR: Quitar blocker
          ref.dismiss();
        });
      }

      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          if (config?.onAction) {
            config.onAction();
          }
          this.enableBottomSheetBackdrop(); // Rehabilitar backdrop
          this.removeClickBlocker(); // AGREGAR: Quitar blocker
          ref.dismiss();
        });
      }
    }
  }, 50);

  return ref;
}
  // Método auxiliar para mostrar el toast de cambios no guardados
  showUnsavedChangesWarning(onConfirmLeave: () => void, onStayEditing?: () => void): void {
    this.showWarning(
      'You have unsend text',
      {
        onAction: onConfirmLeave, // Cuando hace click en "Cancel Anyway"
        onCancel: onStayEditing   // Cuando hace click en "Keep Editing"
      }
    );
  }

  // Métodos simples para controlar el backdrop
  private disableBottomSheetBackdrop(): void {
    const backdrop = document.querySelector('.cdk-overlay-backdrop');
    if (backdrop) {
      (backdrop as HTMLElement).style.pointerEvents = 'none';
    }
  }

  private enableBottomSheetBackdrop(): void {
    const backdrop = document.querySelector('.cdk-overlay-backdrop');
    if (backdrop) {
      (backdrop as HTMLElement).style.pointerEvents = 'auto';
    }
  }

  showError(message: string): void {
    const ref = this.snackBar.open(message, '✖', {
      duration: 3000,
      panelClass: ['toast-error'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });

    ref.onAction().subscribe(() => {
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
      ref.dismiss();
    });
  }

  private addClickBlocker(): void {
  const blocker = document.createElement('div');
  blocker.className = 'toast-click-blocker';
  blocker.id = 'toast-click-blocker';
  document.body.appendChild(blocker);
}

private removeClickBlocker(): void {
  const blocker = document.getElementById('toast-click-blocker');
  if (blocker) {
    blocker.remove();
  }
}
}