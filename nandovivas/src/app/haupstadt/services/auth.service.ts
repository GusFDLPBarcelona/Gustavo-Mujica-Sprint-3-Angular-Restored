import { Injectable, inject, signal, computed } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);

  // Signal con el usuario actual — null si no hay sesión
  readonly currentUser = signal<User | null>(null);

  // Se recalcula automáticamente cuando currentUser cambia
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  constructor() {
    // Firebase avisa cada vez que cambia el estado de auth (login, logout, recarga de página)
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.set(user);
    });
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate(['/haupstadt/login']);
  }
}
