// theme.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private modoOscuro: boolean = false;

  constructor() {
    const config = localStorage.getItem('modoOscuro');
    if (config !== null) {
      this.modoOscuro = config === 'true';
    }
    this.aplicarTema();
  }

  toggleModoOscuro() {
    this.modoOscuro = !this.modoOscuro;
    localStorage.setItem('modoOscuro', this.modoOscuro.toString());
    this.aplicarTema();
  }

  setModoOscuro(activado: boolean) {
    this.modoOscuro = activado;
    localStorage.setItem('modoOscuro', this.modoOscuro.toString());
    this.aplicarTema();
  }

  estaActivado(): boolean {
    return this.modoOscuro;
  }

  private aplicarTema() {
    if (this.modoOscuro) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
}