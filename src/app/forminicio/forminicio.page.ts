import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { FirestoreService } from '../SERVICES/firestore.service';

@Component({
  selector: 'app-forminicio',
  templateUrl: './forminicio.page.html',
  styleUrls: ['./forminicio.page.scss'],
})
export class ForminicioPage implements OnInit {
  uid: string | null = '';
  currentSection: number = 1;
  formInicio!: FormGroup;
  //userId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
        // Inicializar el formulario en el constructor
        this.formInicio = this.fb.group({
          discapacidadFisica: ['', Validators.required],
          tipoDiscapacidadFisica: [''],
          discapacidadMental: ['', Validators.required],
          tipoDiscapacidadMental: [''],
          trastornoPsicologico: ['', Validators.required],
          tipoTratamiento: [''],
        });
  }

  async ngOnInit() {
    await this.checkAuthState();
    // Eliminar this.initForm() ya que el formulario se inicializa en el constructor
    this.setupFormValidations(); // Nuevo método para configurar las validaciones
  
    this.route.paramMap.subscribe(params => {
      this.uid = params.get('uid');
      console.log('UID del usuario:', this.uid);
    });
  }
  private setupFormValidations() {
    // Mover aquí las validaciones que estaban en initForm()
    this.formInicio.get('discapacidadFisica')?.valueChanges.subscribe(value => {
      const tipoControl = this.formInicio.get('tipoDiscapacidadFisica');
      if (value === 'Si') {
        tipoControl?.setValidators(Validators.required);
      } else {
        tipoControl?.clearValidators();
        tipoControl?.reset();
      }
      tipoControl?.updateValueAndValidity();
    });
  
    this.formInicio.get('discapacidadMental')?.valueChanges.subscribe(value => {
      const tipoControl = this.formInicio.get('tipoDiscapacidadMental');
      if (value === 'Si') {
        tipoControl?.setValidators(Validators.required);
      } else {
        tipoControl?.clearValidators();
        tipoControl?.reset();
      }
      tipoControl?.updateValueAndValidity();
    });
  }

  private async checkAuthState() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
    });
    await loading.present();

    try {
      this.uid = await this.firestoreService.getCurrentUserId();
      
      if (!this.uid) {
        await this.router.navigate(['/login']);
        await this.mostrarAlerta('Por favor inicie sesión para continuar');
        return;
      }

      // Verificar si ya completó el formulario
      const hasCompleted = await this.firestoreService.hasCompletedForm(this.uid);
      if (hasCompleted) {
        await this.router.navigate(['/home']);
        await this.mostrarAlerta('Ya has completado este formulario anteriormente');
        return;
      }

    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      await this.mostrarAlerta('Error al verificar la autenticación');
    } finally {
      await loading.dismiss();
    }
  }
  async submitForm() {
    if (!this.formInicio.valid) {
      await this.mostrarAlerta('Por favor complete todos los campos requeridos.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Enviando formulario...'
    });
    await loading.present();

    try {
      await this.firestoreService.saveFormInicio(this.formInicio.value);
      await loading.dismiss();
      await this.mostrarAlerta('Formulario enviado con éxito');
      this.router.navigate(['/home']);
    } catch (error) {
      await loading.dismiss();
      console.error('Error al enviar el formulario:', error);
      await this.mostrarAlerta('Error al enviar el formulario. Por favor intente nuevamente.');
    }
  }
  

  async prevSection() {
    if (this.currentSection > 1) {
      this.currentSection--;
    }
  }

  async nextSection() {
    if (this.isSectionValid()) {
      if (this.currentSection < 3) {
        this.currentSection++;
      }
    } else {
      await this.mostrarAlerta('Por favor complete todos los campos requeridos.');
    }
  }

  isSectionValid(): boolean {
    switch (this.currentSection) {
      case 1:
        return this.formInicio.get('discapacidadFisica')?.valid ?? false;
      case 2:
        return this.formInicio.get('discapacidadMental')?.valid ?? false;
      case 3:
        return this.formInicio.get('trastornoPsicologico')?.valid ?? false;
      default:
        return false;
    }
  }



  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Aviso',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
}