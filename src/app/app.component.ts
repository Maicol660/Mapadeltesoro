import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [CommonModule, RouterOutlet, IonicModule]
})
export class AppComponent implements OnInit {
  private static audio: HTMLAudioElement;
  private static sonidoActivado: boolean = true;

  constructor() {
    // Inicializar el audio
    AppComponent.audio = new Audio();
    AppComponent.audio.src = 'assets/Sounds/saveinsta.cc_320kbps-the-vengeful-spartan-main-menu-version-god-of-war-1-soundtrack.mp3';
    AppComponent.audio.load();
    AppComponent.audio.loop = true;
  }

  ngOnInit() {
    // Cargar configuración
    const sonidoGuardado = localStorage.getItem('sonidoActivado');
    if (sonidoGuardado !== null) {
      AppComponent.sonidoActivado = sonidoGuardado === 'true';
    }
    AppComponent.actualizarAudio();
  }

  public static cambiarEstadoSonido(activado: boolean): void {
    AppComponent.sonidoActivado = activado;
    localStorage.setItem('sonidoActivado', String(activado));
    AppComponent.actualizarAudio();
  }

  public static obtenerEstadoSonido(): boolean {
    return AppComponent.sonidoActivado;
  }

  private static actualizarAudio(): void {
    if (AppComponent.sonidoActivado) {
      AppComponent.audio.play().catch(e => console.log('Audio no pudo reproducirse:', e));
    } else {
      AppComponent.audio.pause();
    }
  }
}