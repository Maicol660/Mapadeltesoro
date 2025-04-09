import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { 
  IonContent,  
  IonButton, 
  IonItem,
  IonLabel,
  IonInput 
} from "@ionic/angular/standalone";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonButton, 
    IonItem,
    IonLabel,
    IonInput,
    FormsModule
  ]
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(
    private router: Router, 
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  // Limpiar todos los campos del formulario
  clearForm() {
    this.username = '';
    this.password = '';
  }

  onLogin() {
    this.loadingCtrl.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent'
    }).then(loading => {
      loading.present();

      this.authService.login(this.username, this.password).subscribe({
        next: (response: any) => { 
          loading.dismiss();
          
          if (response && response['success']) {  
            this.showAlert(
              'Éxito', 
              response['message'] || 'Inicio de sesión exitoso.'
            ).then(() => {
              this.clearForm(); 
              this.router.navigate(['/inicio']);
            });
          } else {
            this.clearForm(); // Limpiar campos si hay error
            this.showAlert(
              'Error', 
              response?.['message'] || 'Error en el inicio de sesión.'
            );
          }
        },
        error: () => {
          loading.dismiss();
          this.clearForm(); // Limpiar campos en caso de error
          this.showAlert(
            'Error', 
            'Error en el inicio de sesión. Por favor, intenta nuevamente.'
          );
        }
      });
    });
  }

  onRegister() {
    this.clearForm(); // Limpiar campos antes de navegar
    this.loadingCtrl.create({
      message: 'Cargando...',
      duration: 1000
    }).then(loading => {
      loading.present();
      this.router.navigate(['/register']).then(() => {
        loading.dismiss();
      });
    });
  }

  private showAlert(header: string, message: string) {
    return this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    }).then(alert => alert.present());
  }
}