import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // Importa el AuthGuard

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage),
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.page').then(m => m.InicioPage),
  },
  {
    path: 'juego1',
    loadComponent: () => import('./pages/juego1/juego1.page').then(m => m.Juego1Page),
  },
  {
    path: 'juego2',
    loadComponent: () => import('./pages/juego2/juego2.page').then(m => m.Juego2Page),
  },
  {
    path: 'juego3',
    loadComponent: () => import('./pages/juego3/juego3.page').then(m => m.Juego3Page)
  },
  {
    path: 'juego4',
    loadComponent: () => import('./pages/juego4/juego4.page').then(m => m.Juego4Page),
  },
  {
    path: 'juego5',
    loadComponent: () => import('./pages/juego5/juego5.page').then(m => m.Juego5Page),
  },
  {
    path: 'juego6',
    loadComponent: () => import('./pages/juego6/juego6.page').then(m => m.Juego6Page),
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then(m => m.SettingsPage),
  },
  {
    path: 'cofre',
    loadComponent: () => import('./pages/cofre/cofre.page').then( m => m.CofrePage)
  },
];
