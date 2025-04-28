import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { IonContent, IonButton } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-juego6',
  templateUrl: './juego6.page.html',
  styleUrls: ['./juego6.page.scss'],
  imports: [IonContent, IonButton, CommonModule, FormsModule],
})
export class Juego6Page implements OnInit, OnDestroy {
  // Variables para almacenar las dimensiones de la pantalla
  screenWidth: number = window.innerWidth;
  screenHeight: number = window.innerHeight;

  // Propiedades del jugador
  playerX = 50; // Posición X inicial del jugador
  playerY = 450; // Posición Y inicial (cerca del borde inferior)
  playerSpeed = 10; // Velocidad de movimiento
  playerHealth = 100; // Salud actual
  playerMaxHealth = 100; // Salud máxima

  // Propiedades del jefe
  bossX = 650; // Posición X inicial del jefe
  bossY = 50;  // Posición Y inicial del jefe (arriba)
  bossHealth = 100; // Salud actual del jefe
  bossMaxHealth = 100; // Salud máxima del jefe
  bossSpeed = 2; // Velocidad de movimiento del jefe
  bossDirection = 1; // Dirección del movimiento (1: derecha, -1: izquierda)
  isAngry = false; // Estado si el jefe está "enojado"

  // Velocidades originales del jefe para poder restaurarlas
  originalBossSpeed = 2;
  originalBossBulletSpeed = 7;

  // Balas del jugador y del jefe
  bullets: any[] = []; // Balas disparadas por el jugador
  bossBullets: any[] = []; // Balas disparadas por el jefe
  bulletSpeed = 10; // Velocidad de las balas del jugador
  bossBulletSpeed = 7; // Velocidad de las balas del jefe
  bossBulletCooldown = 0; // Temporizador entre disparos del jefe

  // Estado general del juego
  gameOver = false; // Indica si el juego terminó
  gameOverMessage = ''; // Mensaje de finalización
  private gameLoop: any; // Referencia al bucle de animación

  constructor(private router: Router, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.updateScreenSize(); // Actualizar tamaño de pantalla
    this.startGame(); // Iniciar el juego
  }

  // Inicia el juego y empieza el bucle de animación
  startGame() {
    this.resetGame();
    const gameUpdate = () => {
      this.updateGame();
      this.gameLoop = requestAnimationFrame(gameUpdate);
    };
    gameUpdate();
  }

  // Resetea todas las variables al estado inicial
  resetGame() {
    this.playerX = 50;
    this.playerY = 450;
    this.playerHealth = 100;
    this.bossX = 50;
    this.bossY = 50;
    this.bossHealth = 100;
    this.bossSpeed = this.originalBossSpeed;
    this.bossBulletSpeed = this.originalBossBulletSpeed;
    this.bossDirection = 1;
    this.isAngry = false;
    document.querySelector('.boss')?.classList.remove('angry');
    this.bullets = [];
    this.bossBullets = [];
    this.gameOver = false;
    this.gameOverMessage = '';
  }

  // Cancela el bucle de animación cuando se destruye el componente
  ngOnDestroy() {
    cancelAnimationFrame(this.gameLoop);
  }

  // Escucha eventos de teclado para mover al jugador o disparar
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.gameOver) return;
    switch(event.key) {
      case 'ArrowLeft': this.movePlayer('izq'); break;
      case 'ArrowRight': this.movePlayer('der'); break;
      case ' ': this.shoot(); break;
    }
  }

  // Actualiza las dimensiones de la pantalla y ajusta posiciones
  updateScreenSize() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.playerX = Math.min(this.playerX, this.screenWidth - 80);
    this.playerY = Math.min(this.playerY, this.screenHeight - 120);
    this.bossX = Math.min(this.bossX, this.screenWidth - 100);
  }

  // Actualiza el estado de todo el juego en cada frame
  updateGame() {
    if (this.gameOver) return;
    this.moveBoss();
    this.updateBullets();
    this.updateBossBullets();
    this.bossShoot();
    this.checkCollisions();

    // Si la salud del jefe baja a la mitad o menos, se enoja
    if (this.bossHealth <= this.bossMaxHealth / 2 && !this.isAngry) {
      this.bossY += 10;
      this.makeBossAngry();
    }
  }

  // Mueve al jugador a izquierda o derecha
  movePlayer(direction: 'izq' | 'der') {
    const maxX = this.screenWidth - 70;
    if (direction === 'izq' && this.playerX > 0) {
      this.playerX -= this.playerSpeed;
    } else if (direction === 'der' && this.playerX < maxX) {
      this.playerX += this.playerSpeed;
    }
  }

  // Mueve al jefe automáticamente de lado a lado
  moveBoss() {
    const maxX = this.screenWidth - 100;
    this.bossX += this.bossSpeed * this.bossDirection;
    if (this.bossX >= maxX || this.bossX <= 50) {
      this.bossDirection *= -1;
    }
  }

  // El jugador dispara una bala
  shoot() {
    this.bullets.push({ x: this.playerX + 80, y: this.playerY, width: 10, height: 20 });
  }

  // El jefe dispara balas hacia el jugador
  bossShoot() {
    if (this.bossBulletCooldown <= 0) {
      this.bossBullets.push({ x: this.bossX - 30, y: this.bossY + 60 });
      this.bossBulletCooldown = this.isAngry ? 30 : 60;
    } else {
      this.bossBulletCooldown--;
    }
  }

  // Cambia el estado del jefe a "enojado" (más rápido y dispara más)
  makeBossAngry() {
    this.bossHealth = Math.max(0, this.bossHealth - 5);
    this.bossY += 10;
    this.bossDirection = 1;
    this.bossSpeed = this.originalBossSpeed * 1.5;
    this.bossBulletSpeed = this.originalBossBulletSpeed * 1.5;
    this.isAngry = true;
    document.querySelector('.boss')?.classList.add('angry');
  }

  // Actualiza la posición de las balas del jugador
  updateBullets() {
    this.bullets = this.bullets.filter(bullet => {
      bullet.y -= this.bulletSpeed;
      return bullet.y > 0;
    });
  }

  // Actualiza la posición de las balas del jefe
  updateBossBullets() {
    this.bossBullets = this.bossBullets.filter(bullet => {
      bullet.y += this.bossBulletSpeed;
      return bullet.y < window.innerHeight;
    });
  }

  // Verifica colisiones entre balas y personajes
  checkCollisions() {
    // Colisiones de balas del jugador contra el jefe
    this.bullets.forEach((bullet, index) => {
      if (this.checkCollision(bullet, this.bossX, this.bossY, 100, 100)) {
        this.bossHealth = Math.max(0, this.bossHealth - 5);
        this.bullets.splice(index, 1);
        if (this.bossHealth <= 0) {
          this.mostrarGanaste();
        }
      }
    });

    // Colisiones de balas del jefe contra el jugador
    this.bossBullets.forEach((bullet, index) => {
      if (this.checkCollision(bullet, this.playerX, this.playerY, 70, 70)) {
        this.playerHealth = Math.max(0, this.playerHealth - 10);
        this.bossBullets.splice(index, 1);
        if (this.playerHealth <= 0) {
          this.finalizarJuego();
        }
      }
    });
  }

  // Comprueba si dos objetos colisionan
  private checkCollision(obj: any, objX: number, objY: number, objWidth: number, objHeight: number) {
    return obj.x >= objX && obj.x <= objX + objWidth && obj.y >= objY && obj.y <= objY + objHeight;
  }

  // Finaliza el juego mostrando una alerta de derrota
  finalizarJuego() {
    this.alertCtrl.create({
      header: '¡Juego Terminado!',
      message: 'Perdiste contra el jefe.',
      buttons: [
        { text: 'Reiniciar', handler: () => this.resetGame() },
        { text: 'Salir', handler: () => this.router.navigate(['/inicio']) }
      ]
    }).then(alerta => alerta.present());
  }

  // Confirma si el jugador quiere salir del juego
  confirmarSalida() {
    this.alertCtrl.create({
      header: '¿Salir del juego?',
      message: '¿Estás seguro que quieres volver al inicio?',
      buttons: [
        { text: 'Quedarme', role: 'cancel' },
        {
          text: 'Salir',
          handler: () => {
            this.router.navigate(['/inicio']);
          }
        }
      ]
    }).then(alerta => alerta.present());
  }

  // Muestra una alerta de victoria
  mostrarGanaste() {
    this.alertCtrl.create({
      header: '¡Ganaste!',
      message: '¡Has vencido al jefe!',
      buttons: [
        {
          text: 'Enviar al cofre',
          handler: () => {
            this.router.navigate(['/cofre']);
          }
        }
      ]
    }).then(alerta => alerta.present());
  }
}
