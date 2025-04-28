import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const currentUser = localStorage.getItem('currentUser');

    if (!currentUser) {
      this.router.navigate(['/login']); // Redirigir al login si no está autenticado
      return false; // No está autenticado, redirigir al login
    } else {
      // Si el usuario está autenticado, permite el acceso a la ruta
      return true;
    }
  }
}
