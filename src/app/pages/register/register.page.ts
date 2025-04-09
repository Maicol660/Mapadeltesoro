import { Component } from '@angular/core';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton,
  IonLoading,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonLoading,
    FormsModule
  ]
})
export class RegisterPage {
  username: string = '';
  email: string = '';
  password: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  onRegister() {
    this.loadingCtrl.create({
      message: 'Registrando...',
      spinner: 'crescent'
    }).then(loading => {
      loading.present();

      this.authService.register(this.username, this.email, this.password).subscribe({
        next: (response: any) => { 
          loading.dismiss();
          
          if (response && response['success']) {  
            this.showAlert(
              'Éxito', 
              response['message'] || 'registro exitoso.'
            ).then(() => {
              this.router.navigate(['/login']);
            });
          } else {
            this.showAlert(
              'Error', 
              response?.['message'] || 'Error en el registro.'
            );
          }
        },
        error: () => {
          loading.dismiss();
          this.showAlert(
            'Error', 
            'Error en el registro. Por favor, intenta nuevamente.'
          );
        }
      });
    });
  }

  onLogin() {
    this.loadingCtrl.create({
      message: 'Cargando...',
      duration: 1000
    }).then(loading => {
      loading.present();
      this.router.navigate(['/login']).then(() => {
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