import { Component, OnInit } from '@angular/core';
import { IonContent, IonLabel, IonItem, IonToggle, IonButton, IonIcon } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppComponent } from '../../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [IonIcon, 
    IonContent,
    IonLabel,
    IonItem,
    IonToggle,
    IonButton,
    CommonModule,
    FormsModule
  ],
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {
  sonidoActivado: boolean = true;
  modoOscuro: boolean = false;
  constructor(
    private router:Router
  ){}

  ngOnInit() {
    this.sonidoActivado = AppComponent.obtenerEstadoSonido();
    const modoOscuroGuardado = localStorage.getItem('modoOscuro');
    this.modoOscuro = modoOscuroGuardado === 'true';
  }

  cambiarSonido() {
    AppComponent.cambiarEstadoSonido(this.sonidoActivado);
  }

  regresarAlInicio() {
    this.router.navigate(['/inicio']);  // Navega al inicio (ajusta la ruta si es necesario)
  }
}