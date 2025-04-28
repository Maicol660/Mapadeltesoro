import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton, AlertController, LoadingController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-juego3',
  templateUrl: './juego3.page.html',
  styleUrls: ['./juego3.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, CommonModule],
  providers: [AlertController, LoadingController]
})
export class Juego3Page {
  /** Arreglo de cartas con sus valores y estados */
  cartas: { valor: number, descubierta: boolean, encontrada: boolean }[] = [];
  /** Arreglo de índices de cartas seleccionadas */
  seleccionadas: number[] = [];
  /** Mensaje para mostrar al jugador */
  mensaje: string = '';
  /** Puntaje actual del juego */
  puntaje: number = 0;
  /** Mejor puntaje hasta ahora */
  mejorPuntaje: number = 0;  // Nueva variable para el mejor puntaje
  /** Mensaje para mostrar al jugador */
  loading: boolean = false;
  /** Tiempo restante para el juego */
  tiempoRestante: number = 60;
  /** Temporizador para el tiempo restante */
  temporizador: any;

  constructor(private alertCtrl: AlertController, private loadingCtrl: LoadingController, private router: Router) {
    this.iniciarJuego();
  }

  iniciarJuego() {
    const valores = [1, 2, 3, 4, 5, 6];
    // Crear un arreglo de cartas duplicadas y mezcladas
    this.cartas = [...valores, ...valores]
      .sort(() => Math.random() - 0.5)
      .map(valor => ({ valor, descubierta: false, encontrada: false }));
    
    // Reiniciar el estado del juego
    this.seleccionadas = [];
    this.mensaje = '';
    this.puntaje = 0; // Reiniciar puntaje al iniciar el juego
    this.tiempoRestante = 90;
    this.iniciarTemporizador();
  }

  iniciarTemporizador() {
    this.temporizador = setInterval(() => {
      this.tiempoRestante--;
    
      if (this.tiempoRestante <= 0) {
        // Si el tiempo se agota, detener el juego y mostrar mensaje
        clearInterval(this.temporizador);
        this.mensaje = '¡Tiempo agotado!';
        this.actualizarMejorPuntaje(); // Actualiza el mejor puntaje al final
        // Muestra la alerta de tiempo agotado
        this.alertCtrl.create({
          header: '¡Tiempo agotado!',
          message: 'No completaste el juego a tiempo. Vamos al siguiente juego.',
          buttons: [{
            text: 'Continuar',
            handler: () => this.router.navigate(['/juego4'])
          }]
        }).then(alerta => alerta.present());
      }
    }, 1000);
  }

  // Método que se ejecuta al seleccionar una carta
  seleccionarCarta(index: number) {
    const carta = this.cartas[index];
    if (carta.descubierta || carta.encontrada || this.seleccionadas.length === 2) return;

    carta.descubierta = true;
    this.seleccionadas.push(index);

    if (this.seleccionadas.length === 2) {
      const [i1, i2] = this.seleccionadas;
      if (this.cartas[i1].valor === this.cartas[i2].valor) {
        this.cartas[i1].encontrada = true;
        this.cartas[i2].encontrada = true;
        this.seleccionadas = [];
        this.puntaje += 10;
        this.mensaje = '¡Coincidencia encontrada!';
        this.verificarGanador();
      } else {
        setTimeout(() => {
          this.cartas[i1].descubierta = false;
          this.cartas[i2].descubierta = false;
          this.seleccionadas = [];
          this.puntaje -= 3;
          this.mensaje = '¡No es una coincidencia!';
        }, 1000);
      }
    }
  }

  verificarGanador() {
    if (this.cartas.every(c => c.encontrada)) {
      this.actualizarMejorPuntaje(); // Actualiza el mejor puntaje al ganar
      this.alertCtrl.create({
        header: '¡Ganaste!',
        message: 'Encontraste todas las cartas. Tu puntaje es: ' + this.puntaje,
        buttons: [{
          text: 'Siguiente Juego',
          handler: () => this.router.navigate(['/juego4'])
        }]
      }).then(alerta => alerta.present());
    }
  }

  // Función para actualizar el mejor puntaje
  actualizarMejorPuntaje() {
    if (this.puntaje > this.mejorPuntaje) {
      this.mejorPuntaje = this.puntaje; // Si el puntaje actual es mejor, actualiza el mejor puntaje
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
    this.alertCtrl.create({
      header: '¿Rendirse?',
      message: '¿Estás seguro que quieres rendirte y continuar con el siguiente juego?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sí, rendirme',
          handler: () => {
            this.router.navigate(['/juego4']);
          }
        }
      ]
    }).then(alerta => alerta.present());
  }
}
