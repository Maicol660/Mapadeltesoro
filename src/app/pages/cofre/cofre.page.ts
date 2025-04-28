import { Component } from '@angular/core';
import { IonContent, IonIcon, IonButton, NavController} from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cofre',
  templateUrl: './cofre.page.html',
  styleUrls: ['./cofre.page.scss'],
  imports: [IonIcon, IonContent, CommonModule, IonButton],
})
export class CofrePage {
  chestOpen = false;
  coins = Array(30).fill(0); // Para las monedas de oro
  particles = Array(30).fill(0); // Para las partículas de efecto

  constructor(private navCtrl: NavController) {}

  openChest() {
    if (!this.chestOpen) {
      this.chestOpen = true;
      
      // Efecto de sonido podrías agregarlo aquí
      // this.soundService.play('chest-open');
    }
  }

  goHome() {
    this.navCtrl.navigateRoot('/inicio');
  }
}