import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-juego1',
  templateUrl: './juego1.page.html',
  styleUrls: ['./juego1.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, CommonModule]
})
export class Juego1Page {
  celdas: boolean[] = [];
  tesoroIndex: number = 0;
  intentos: number = 0;
  mensaje: string = 'Encuentra el tesoro escondido!';

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {
    this.iniciarJuego(); // Por si es la primera carga
  }

  ionViewWillEnter() {
    this.iniciarJuego(); // Cada vez que se entra a la vista
  }

  iniciarJuego() {
    this.celdas = new Array(9).fill(false);
    this.tesoroIndex = Math.floor(Math.random() * 9);
    this.intentos = 0;
    this.mensaje = 'Encuentra el tesoro escondido!';
  }

  buscarTesoro(index: number) {
    if (this.celdas[index]) return;

    this.celdas[index] = true;
    this.intentos++;

    if (index === this.tesoroIndex) {
      this.mensaje = `¡Ganaste en ${this.intentos} intentos!`;
      this.mostrarGanaste();
    } else {
      this.mensaje = 'Sigue buscando!';
    }
  }

  mostrarGanaste() {
    this.alertCtrl.create({
      header: '¡Tesoro Encontrado!',
      message: `Felicidades, lo lograste en ${this.intentos} intentos.`,
      buttons: [
        { text: 'Jugar otra vez', handler: () => this.iniciarJuego() },
        { text: 'Volver al inicio', handler: () => this.router.navigate(['/inicio']) }
      ]
    }).then(alerta => alerta.present());
  }

  confirmarSalida() {
    this.alertCtrl.create({
      header: '¿Salir del juego?',
      message: '¿Estás seguro que quieres volver al inicio?',
      buttons: [
        { text: 'Quedarme', role: 'cancel' },
        {
          text: 'Salir',
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              message: 'Cargando...',
              duration: 1000
            });
            await loading.present();
            this.router.navigate(['/inicio']).then(() => loading.dismiss());
          }
        }
      ]
    }).then(alerta => alerta.present());
  }
}