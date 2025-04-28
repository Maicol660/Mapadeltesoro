import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton, AlertController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-juego2',
  templateUrl: './juego2.page.html',
  styleUrls: ['./juego2.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, CommonModule],
})
export class Juego2Page implements OnDestroy {
  piezas: (number | null)[] = [];
  loading: boolean = false;
  loadingCtrl: any;
  mensaje: string = '';
  tiempoRestante: number = 300; // 5 minutos en segundos
  timer: any;
  mejorTiempo: number | null = null; // NUEVO: guarda el mejor tiempo

  constructor(private alertCtrl: AlertController, private router: Router) {
    this.iniciarJuego();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  iniciarJuego() {
    this.piezas = [1, 2, 3, 4, 5, 6, 7, 8, null];
    this.desordenar();
    this.mensaje = '';
    this.tiempoRestante = 300;
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante <= 0) {
        clearInterval(this.timer);
        this.mensaje = '¡Tiempo agotado!';
        this.alertCtrl.create({
          header: 'Fin del tiempo',
          message: 'Se acabó el tiempo. ¿Quieres volver a intentarlo?',
          buttons: [
            { text: 'Siguiente Juego', handler: () => this.router.navigate(['/juego3']) },
            { text: 'Salir', handler: () => this.router.navigate(['/inicio']) }
          ]
        }).then(alerta => alerta.present());
      }
    }, 1000);
  }

  get tiempoFormateado(): string {
    const min = Math.floor(this.tiempoRestante / 60);
    const sec = this.tiempoRestante % 60;
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  }

  // NUEVO: Formato del mejor tiempo
  get mejorTiempoFormateado(): string {
    if (this.mejorTiempo === null) return '';
    const min = Math.floor(this.mejorTiempo / 60);
    const sec = this.mejorTiempo % 60;
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  }

  desordenar() {
    for (let i = this.piezas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.piezas[i], this.piezas[j]] = [this.piezas[j], this.piezas[i]];
    }
  }

  mover(index: number) {
    const vacio = this.piezas.indexOf(null);
    const vecinos = [index - 1, index + 1, index - 3, index + 3];
    if (vecinos.includes(vacio) && this.esMovimientoValido(index, vacio)) {
      [this.piezas[index], this.piezas[vacio]] = [this.piezas[vacio], this.piezas[index]];
      this.verificarGanador();
    }
  }

  esMovimientoValido(i: number, j: number): boolean {
    const filaI = Math.floor(i / 3), colI = i % 3;
    const filaJ = Math.floor(j / 3), colJ = j % 3;
    return Math.abs(filaI - filaJ) + Math.abs(colI - colJ) === 1;
  }

  verificarGanador() {
    const orden = [1, 2, 3, 4, 5, 6, 7, 8, null];
    if (this.piezas.every((val, i) => val === orden[i])) {
      clearInterval(this.timer);
      this.mensaje = '¡Ganaste!';

      // NUEVO: actualizar mejor tiempo si es mejor
      const tiempoInvertido = 300 - this.tiempoRestante;
      if (this.mejorTiempo === null || tiempoInvertido < this.mejorTiempo) {
        this.mejorTiempo = tiempoInvertido;
      }

      this.alertCtrl.create({
        header: '¡Felicidades!',
        message: `Completaste el rompecabezas correctamente.
                  Tu tiempo: ${this.tiempoFormateado}.
                  Mejor tiempo: ${this.mejorTiempoFormateado}.`,
        buttons: [
          { text: 'Siguiente Juego', handler: () => this.router.navigate(['/juego3']) },
        ]
      }).then(alerta => alerta.present());
    }
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

  rendirse() {
    clearInterval(this.timer);
    this.alertCtrl.create({
      header: '¿Rendirse?',
      message: '¿Estás seguro que quieres rendirte y continuar con el siguiente juego?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sí, rendirme',
          handler: () => {
            this.router.navigate(['/juego3']);
          }
        }
      ]
    }).then(alerta => alerta.present());
  }
}
