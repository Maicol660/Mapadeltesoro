import { Component } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IonContent, IonButton } from "@ionic/angular/standalone"; 
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-juego4',
  templateUrl: './juego4.page.html',
  styleUrls: ['./juego4.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, CommonModule],
})
export class Juego4Page {
  tiempoRestante: number = 10; // Tiempo en segundos
  temporizador: any;
  puntaje: number = 0;
  mejorPuntaje: number = 0;  // Variable para el mejor puntaje
  mensaje: string = '';
  preguntaActual: any;
  preguntas: any[] = [
    {
      pregunta: '¿Qué objeto usan los piratas para encontrar tesoros?',
      opciones: ['Brújula', 'Telescopio', 'Mapa', 'Espada'],
      respuestaCorrecta: 2 // Mapa
    },
    {
      pregunta: '¿Qué símbolo suele marcar el lugar del tesoro en un mapa?',
      opciones: ['Un círculo', 'Una estrella', 'Una X', 'Un cofre'],
      respuestaCorrecta: 2 // Una X
    },
    {
      pregunta: '¿Dónde suelen esconderse los tesoros en las historias piratas?',
      opciones: ['En la cima de una montaña', 'En islas desiertas', 'En castillos', 'En ciudades'],
      respuestaCorrecta: 1 // En islas desiertas
    },
    {
      pregunta: '¿Cuál de estos personajes suele acompañar a los piratas?',
      opciones: ['Un loro', 'Un gato', 'Un dragón', 'Un perro'],
      respuestaCorrecta: 0 // Un loro
    },
    {
      pregunta: '¿Qué transporte usan los piratas para buscar tesoros?',
      opciones: ['Submarinos', 'Barcos', 'Aviones', 'Carros'],
      respuestaCorrecta: 1 // Barcos
    }
  ];

  constructor(private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private navCtrl: NavController) {
    // Iniciar el juego al cargar el componente
    this.siguientePregunta();
  }

  siguientePregunta() {
    if (this.preguntas.length > 0) {
      const indice = Math.floor(Math.random() * this.preguntas.length);
      this.preguntaActual = this.preguntas[indice];
      this.preguntas.splice(indice, 1);
      this.startTimer();
    } else {
      this.Siguientejuego();
    }
  }

  startTimer() {
    clearInterval(this.temporizador);
    this.tiempoRestante = 10;
    this.temporizador = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante === 0) {
        clearInterval(this.temporizador);
        this.mensaje = '¡Se acabó el tiempo!';
        this.siguientePregunta();
      }
    }, 1000);
  }

  verificarRespuesta(opcionSeleccionada: number) {
    clearInterval(this.temporizador);
    const correcta = this.preguntaActual.opciones[this.preguntaActual.respuestaCorrecta];
    if (opcionSeleccionada === this.preguntaActual.respuestaCorrecta) {
      this.puntaje += 10;
      this.mensaje = '¡Respuesta Correcta!';
    } else {
      this.mensaje = `Incorrecto. La respuesta correcta era: ${correcta}`;
      this.puntaje -= 5;
    }

    setTimeout(() => {
      this.mensaje = '';
      this.siguientePregunta();
    }, 500);
  }

  Siguientejuego() {
    this.actualizarMejorPuntaje();
    this.alertCtrl.create({
      header: '¡Ganaste!',
      message: 'Siguiente juego',
      buttons: [{ text: 'Siguiente Juego', handler: () => this.router.navigate(['/juego5']) }]
    }).then(alerta => alerta.present());
  }

  actualizarMejorPuntaje() {
    if (this.puntaje > this.mejorPuntaje) {
      this.mejorPuntaje = this.puntaje; // Actualiza el mejor puntaje
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
            this.router.navigate(['/juego5']);
          }
        }
      ]
    }).then(alerta => alerta.present());
  }
}
