import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IonContent, IonButton } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-juego5',
  templateUrl: './juego5.page.html',
  styleUrls: ['./juego5.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, CommonModule, FormsModule]
})
export class Juego5Page implements OnInit, OnDestroy {
  /** Posición actual del barco (0 = Izquierda, 1 = Centro, 2 = Derecha) */
  posicionBarco: number = 1;

  /** obstáculos activos con sus posiciones {fila, columna} */
  obstaculos: { fila: number, columna: number }[] = [];

  /** Puntuación actual del jugador */
  puntuacion: number = 0;

  /** Mejor puntaje registrado */
  mejorPuntaje: number = 0;

  /** Indica si el juego ha terminado */
  gameOver: boolean = false;

  /** Referencia al intervalo de generación de obstáculos */
  intervaloObstaculos: any;

  /** Referencia al intervalo principal del juego */
  intervaloJuego: any;

  /** Velocidad actual de generación de obstáculos (en milisegundos) */
  velocidad: number = 1000;

  /** Contador de obstáculos evitados con éxito */
  obstaculosEvitados: number = 0;

  /** Valor actual del contador para iniciar (3, 2, 1) */
  contador: number = 3;

  /** Controla la visibilidad del contador inicial */
  mostrandoContador: boolean = true;

  /** Referencia al intervalo del contador inicial */
  intervaloContador: any;

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {}

  /**
   * Método del ciclo de vida de Angular
   * Inicializa el juego al cargar el componente
   */
  ngOnInit() {
    // Inicializar el barco en la posición central
    this.iniciarContador();
  }

  /**
   * Método del ciclo de vida de Angular
   * Limpia los intervalos al destruir el componente para evitar fugas de memoria
   */
  ngOnDestroy() {
    // Limpiar intervalos para evitar fugas de memoria
    clearInterval(this.intervaloObstaculos);
    clearInterval(this.intervaloJuego);
    clearInterval(this.intervaloContador);
  }

  /**
   * Escucha eventos de teclado para controlar el barco
   * Evento de teclado
   */
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Verifica si el juego ha terminado antes de procesar la entrada
    if (this.gameOver) return;
    // Mover el barco según la tecla presionada
    switch(event.key) {
      case 'ArrowLeft':
        this.moverBarco('izq');
        break;
      case 'ArrowRight':
        this.moverBarco('der');
        break;
    }
  }

  /**
   * Inicia la cuenta regresiva inicial
   */
  iniciarContador() {
    this.contador = 3;
    this.mostrandoContador = true;
    this.intervaloContador = setInterval(() => {
      this.contador--;
      // Actualizar el mensaje del contador
      if (this.contador <= 0) {
        // Cuando el contador llega a 0, iniciar el juego
        clearInterval(this.intervaloContador);
        this.mostrandoContador = false;
        this.iniciarJuego();
      }
    }, 1000);
  }

  /**
   * Devuelve el texto a mostrar en el contador inicial
   * Conteo para iniciar
   */
  obtenerMensajeContador(): string {
    if (this.contador > 0) {
      return this.contador.toString();
    }
    return '¡YA!';
  }

  /**
   * Inicializa el estado principal del juego
   */
  iniciarJuego() {
    // Limpiar intervalos previos
    clearInterval(this.intervaloObstaculos);
    clearInterval(this.intervaloJuego);
    
    // Reiniciar estado del juego
    this.gameOver = false;
    this.puntuacion = 0;
    this.obstaculos = [];
    this.velocidad = 400;
    
    // Iniciar generación de obstáculos
    this.intervaloObstaculos = setInterval(() => {
      // Generar un nuevo obstáculo en una columna aleatoria
      this.obstaculos.push({
        fila: 0,
        // Columna aleatoria entre 0 y 2 (izquierda, centro, derecha)
        columna: Math.floor(Math.random() * 3)
      });
      // Aumentar dificultad reduciendo el intervalo
      this.velocidad = Math.max(300, this.velocidad - 10);
    }, this.velocidad);

    // Iniciar bucle principal del juego
    this.intervaloJuego = setInterval(() => this.actualizarJuego(), 100);
  }

  /**
   * Actualiza el estado del juego en cada frame
   */
  actualizarJuego() {
    // Mover todos los obstáculos hacia abajo
    this.obstaculos.forEach(obs => obs.fila += 1);

    // Contar obstáculos que salieron de pantalla (evitados)
    const evitados = this.obstaculos.filter(obs => obs.fila >= 9).length;
    this.obstaculosEvitados += evitados;
    this.puntuacion = this.obstaculosEvitados; 

    // Eliminar obstáculos que salieron de pantalla
    this.obstaculos = this.obstaculos.filter(obs => obs.fila < 9);

    // Detectar colisiones
    const colision = this.obstaculos.some(obs => 
      obs.fila === 8 && obs.columna === this.posicionBarco
    );

    if (colision) {
      // Si hay colisión, finalizar el juego
      this.finalizarJuego();
    }
  }

  /**
   * Mueve el barco en la dirección especificada
   * 'izq' para izquierda, 'der' para derecha
   */
  moverBarco(direccion: 'izq' | 'der') {
    // Mover el barco a la izquierda o derecha según la dirección
    if (this.gameOver) return;

    // Limitar el movimiento del barco a las posiciones
    this.posicionBarco = Math.max(0, Math.min(2, this.posicionBarco + (direccion === 'izq' ? -1 : 1)));
  }

  /**
   * Maneja el fin del juego por colisión
   */
  finalizarJuego() {
    // Mostrar alerta de fin de juego
    this.gameOver = true;
    // Limpiar intervalos
    clearInterval(this.intervaloObstaculos);
    clearInterval(this.intervaloJuego);
    clearInterval(this.intervaloContador);

    // Actualizar el mejor puntaje si es necesario
    if (this.puntuacion > this.mejorPuntaje) {
      this.mejorPuntaje = this.puntuacion;
    }

    this.alertCtrl.create({
      message: '¡Naufragaste!',
      buttons: [{ text: 'Siguiente Juego', handler: () => this.router.navigate(['/juego6']) }]
    }).then(alerta => alerta.present());
  }

  /**
   * Reinicia completamente el juego
   */
  reiniciarJuego() {
    this.iniciarContador();
  }

  /**
   * Muestra una alerta genérica
   */
  mostrarAlerta(titulo: string, mensaje: string) {
    const alert = this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    }).then(alerta => alerta.present());
  }

  /**
   * Muestra diálogo de confirmación para salir del juego
   */
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

  /**
   * Muestra diálogo para rendirse y continuar
   */
  rendirse() {
    this.alertCtrl.create({
      header: '¿Rendirse?',
      message: '¿Estás seguro que quieres rendirte y continuar con el siguiente juego?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sí, rendirme',
          handler: () => {
            this.router.navigate(['/inicio']);
          }
        }
      ]
    }).then(alerta => alerta.present());
  }
}
