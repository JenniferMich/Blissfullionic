import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../SERVICES/firestore.service';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importa esto
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['../login/login.page.scss'],
})
export class SignupPage implements OnInit {
  signupForm: FormGroup;
  
  constructor(
    private firestoreService: FirestoreService,
    private alertController: AlertController,
    private formBuilder: FormBuilder ,// Inyecta FormBuilder
    private router: Router // Inyecta el servicio Router
  ) {
    // Crea el formulario con validaciones
    this.signupForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      nombreFamiliar: ['', [Validators.required, Validators.minLength(2)]],
      numeroFamiliar: ['', [Validators.required, Validators.pattern('^[0-9]{8,10}$')]], // Para números de 8-10 dígitos
      numeroPsico: ['', [Validators.required, Validators.pattern('^[0-9]{8,10}$')]],
      contrasena: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {
    console.log('Signup page loaded');
  }

  // Getters para facilitar el acceso a los controles del formulario en el template
  get nombre() { return this.signupForm.get('nombre'); }
  get correo() { return this.signupForm.get('correo'); }
  get nombreFamiliar() { return this.signupForm.get('nombreFamiliar'); }
  get numeroFamiliar() { return this.signupForm.get('numeroFamiliar'); }
  get numeroPsico() { return this.signupForm.get('numeroPsico'); }
  get contrasena() { return this.signupForm.get('contrasena'); }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async registerUser() {
    if (this.signupForm.invalid) {
      await this.showAlert('Error', 'Por favor, completa todos los campos correctamente');
      this.markFormGroupTouched(this.signupForm);
      return;
    }

    try {
     // Verificar si el correo ya está en uso
     const emailExists = await this.firestoreService.getUserByEmail(this.signupForm.value.correo);
    
     if (emailExists) {
       await this.showAlert('Error', 'El correo ya está en uso');
       return;
     }
 
     // Registrar y autenticar al usuario
     await this.firestoreService.addUser(this.signupForm.value);
 
     const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Usuario registrado y autenticado exitosamente',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.signupForm.reset();
          
          // Obtener el UID del usuario y redirigir
          this.firestoreService.getCurrentUserId().then(uid => {
            if (uid) {
              // Redirigir a la página del formulario con el UID
              this.router.navigate([`/forminicio/${uid}`]);
            } else {
              console.error('Error: UID no encontrado');
            }
          });
        }
      }]
    });
 
    await alert.present();
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      await this.showAlert('Error', 'Hubo un problema al registrar el usuario');
    }
  }

  // Método auxiliar para marcar todos los campos como tocados
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}