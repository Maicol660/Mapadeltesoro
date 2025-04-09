import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';  // 👈 Importar el  Guard



export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.page').then( m => m.InicioPage)
  },
  {
    path: 'juego1',
    loadComponent: () => import('./pages/juego1/juego1.page').then( m => m.Juego1Page)
  },
];
