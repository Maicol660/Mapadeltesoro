// Importaciones de Angular, Ionic y módulos necesarios
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton, IonAlert } from '@ionic/angular/standalone';

// Decorador que define el componente
@Component({
  selector: 'app-juego1',                   
  templateUrl: './juego1.page.html',        
  styleUrls: ['./juego1.page.scss'],
  imports: [ IonContent, IonButton, CommonModule] // Módulos importados
})
export class Juego1Page {// Clase principal del componente
  celdas: boolean[] = []; // Array de celdas del tablero (9 posiciones)
  tesoroIndex: number = 0; // Índice donde está escondido el tesoro
  intentos: number = 0; // Número de intentos realizados
  mensaje: string = 'Encuentra el tesoro escondido!'; // Mensaje mostrado al jugador
  mejorIntentos: number | null = null;         // Récord del menor número de intentos

  constructor(
    private router: Router, // Controlador de navegación
    private alertCtrl: AlertController, // Controlador de alertas
    private loadingCtrl: LoadingController // Controlador de loading (spinners)
  ) {
    this.iniciarJuego(); // Iniciar el juego cuando se crea la página
  }

  // Método que se ejecuta cuando la página va a entrar en vista
  ionViewWillEnter() {
    this.iniciarJuego(); // Reiniciar juego cada vez que entra
  }

  // Método para inicializar o reiniciar el juego
  iniciarJuego() {
    this.celdas = new Array(9).fill(false); // 9 celdas todas en falso (no seleccionadas)
    this.tesoroIndex = Math.floor(Math.random() * 9); // Elegir aleatoriamente dónde está el tesoro
    this.intentos = 0; // Reiniciar contador de intentos
    this.mensaje = 'Encuentra el tesoro escondido!'; // Mensaje inicial
  }

  // Método que se ejecuta al hacer clic en una celda
  buscarTesoro(index: number) {
    if (this.celdas[index]) return; // Si ya se había presionado, no hacer nada

    this.celdas[index] = true; // Marcar la celda como seleccionada
    this.intentos++; // Incrementar intentos

    if (index === this.tesoroIndex) {  // Si encontró el tesoro
      this.actualizarMejorIntentos(this.intentos); // Actualizar el mejor número de intentos
      this.mensaje = `¡Encontraste el tesoro en ${this.intentos} intentos!`;
      this.mostrarGanaste();
    } else if (this.intentos >= 5) { // Si agotó los 5 intentos
      this.mensaje = '¡Perdiste! No encontraste el tesoro.';
      this.mostrarPerdiste();
    } else { // Si aún tiene intentos
      this.mensaje = `Intentos restantes: ${5 - this.intentos}`;
    }
  }

  // Actualizar el mejor número de intentos
  actualizarMejorIntentos(nuevosIntentos: number) {
    // Si es la primera vez o si el nuevo número de intentos es menor que el mejor
    if (this.mejorIntentos === null || nuevosIntentos < this.mejorIntentos) {
      // Actualizar el mejor número de intentos
      this.mejorIntentos = nuevosIntentos;
    }
  }

  // Mostrar alerta de que perdió el juego
  mostrarPerdiste() {
    this.alertCtrl.create({
      // Título de la alerta
      header: '¡Perdiste!',
      // Mensaje de la alerta
      message: 'No encontraste el tesoro. Vamos al siguiente juego.',
      buttons: [
        {
          text: 'Continuar',
          handler: () => {  // Cuando el jugador acepta
            this.loadingCtrl.create({
              // Crear un loading spinner mientras se cambia de pantalla
              message: 'Cargando...',
              // Mensaje que muestra el spinner
              duration: 1000, // Tiempo que dura (1 segundo)
              // Duración del loading
            }).then(loading => {
              // Mostrar el loading
              loading.present();
              // Navegar a la página de juego2
              this.router.navigate(['/juego2']).then(() => loading.dismiss()); // Ir a juego2
            });
          }
        }
      ]
    }).then(alerta => alerta.present());
  }

  // Mostrar alerta de que ganó el juego
  mostrarGanaste() {
    this.alertCtrl.create({
      header: '¡Tesoro Encontrado!',
      message: `¡Lo lograste en ${this.intentos} intentos!
                Mejor récord en esta partida: ${this.mejorIntentos} intentos.`,
      buttons: [
        {
          text: 'Siguiente juego',
          handler: () => {  // Cuando el jugador acepta
            this.loadingCtrl.create({
              message: 'Cargando...',
              duration: 1000
            }).then(loading => {
              loading.present();
              this.router.navigate(['/juego2']).then(() => loading.dismiss()); // Ir a juego2
            });
          }
        }
      ]
    }).then(alerta => alerta.present());
  }

  // Confirmar si el jugador quiere salir del juego y volver al inicio
  confirmarSalida() {
    this.alertCtrl.create({
      header: '¿Salir del juego?',
      message: '¿Quieres volver al inicio?',
      buttons: [
        { text: 'Quedarme', role: 'cancel' }, // Botón para cancelar
        {
          text: 'Salir',
          handler: () => { // Cuando elige salir
            this.loadingCtrl.create({
              message: 'Cargando...',
              duration: 1000
            }).then(loading => {
              loading.present();
              this.router.navigate(['/inicio']).then(() => loading.dismiss()); // Ir a inicio
            });
          }
        }
      ]
    }).then(alerta => alerta.present());
  }

  // Confirmar si el jugador quiere rendirse y pasar al siguiente juego
  rendirse() {
    this.alertCtrl.create({
      header: '¿Rendirse?',
      message: '¿Quieres rendirte y pasar al siguiente juego?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' }, // Botón cancelar
        {
          text: 'Sí, rendirme',
          handler: () => { // Navegar directamente a juego3
            this.router.navigate(['/juego3']);
          }
        }
      ]
    }).then(alerta => alerta.present());
  }
}
