import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../SERVICES/firestore.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  loading: boolean = false;

  constructor(
    private firestoreService: FirestoreService,
    private router: Router,
    private alertController: AlertController // Añadimos AlertController aquí
  ) {}

  ngOnInit() {
    console.log('LoginPage loaded');
  }

  async onLogin() {
    this.loading = true;

    try {
      const isValidUser = await this.firestoreService.validateUser(this.email, this.password);
      if (isValidUser) {
        console.log('Inicio de sesión exitoso');
        this.router.navigate(['/home']); // Redirige a la página principal
      } else {
        this.showAlert('Correo electrónico o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      this.showAlert('Hubo un problema al iniciar sesión. Inténtalo de nuevo más tarde.');
    } finally {
      this.loading = false;
    }
  }

  async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async signInWithGoogle() {
    try {
      const success = await this.firestoreService.loginWithGoogle();
      if (success) {
        // Navegar a la página de inicio 
        this.router.navigate(['/home']);
      } else {
        // Manejar el error
        console.error('Error en el inicio de sesión con Google');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

}
