// Importaciones necesarias de Angular e Ionic
import { Component } from '@angular/core';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { NavController, LoadingController } from '@ionic/angular';

// Decorador @Component define el componente
@Component({
  selector: 'app-inicio', // Nombre del selector usado en la app
  templateUrl: './inicio.page.html', // Archivo HTML asociado
  styleUrls: ['./inicio.page.scss'], // Archivo de estilos asociado
  standalone: true,   // El componente se usa de manera independiente (sin módulo)
  imports: [        // Componentes de Ionic importados directamente
    IonContent,
    IonButton
  ]
})
export class InicioPage { // Clase principal del componente
  imgLoaded: boolean = false; // Variable que controla si la imagen cargó o no

  constructor(
    private navCtrl: NavController, // Controlador de navegación de Ionic
    private loadingCtrl: LoadingController // Controlador de carga (spinners/esperas)
  ) {}

  // Método que se ejecuta cuando la imagen se ha cargado correctamente
  onimgpirata() {
    this.imgLoaded = true;
  }

  // Método para limpiar formularios (por si se necesita en el futuro)
  cleanForm() {
    // Limpiar el formulario si es necesario
  } 

  // Método que maneja el botón "Comenzar"
  onStart() {
    // Crear un loading spinner mientras se cambia de pantalla
    this.loadingCtrl.create({
      message: 'Ingresando...', // Mensaje que muestra el spinner
      duration: 1000, // Tiempo que dura (1 segundo)
      spinner: 'dots', // Tipo de animación del loading
      cssClass: 'custom-loading' // Clase CSS personalizada
    }).then(loading => {
      loading.present(); // Mostrar el loading
      setTimeout(() => {
        this.navCtrl.navigateForward('/juego1'); // Navegar a la ruta del juego después de 1 segundo
      }, 1000);
    });
  }

  // Método que maneja el botón "Opciones"
  onOpciones() {
    this.navCtrl.navigateForward('/settings'); // Navegar a la pantalla de configuraciones
  }

  // Método que maneja el botón "Salir"
  onLogout() {
    this.cleanForm(); // Llamar al método para limpiar formulario (si fuera necesario)
    
    this.loadingCtrl.create({
      message: 'Saliendo...', // Mensaje del spinner de salida
      duration: 1000, // Duración de 1 segundo
      spinner: 'dots',
      cssClass: 'custom-loading'
    }).then(loading => {
      loading.present(); // Mostrar el loading
      setTimeout(() => {
        this.navCtrl.navigateRoot('/login'); // Navegar a la pantalla de login
      }, 1000);
    });
  }
}
