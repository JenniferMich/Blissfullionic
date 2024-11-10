import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, from, map, Observable, switchMap } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';


  interface usuario {
    nombre: string;
    correo: string;
    nombreFamiliar: string;
    numeroFamiliar: string;
    numeroPsico: string;
    contrasena: string;
  }

  interface formInicio {
    discapacidadFisica: string;
    tipoDiscapacidadFisica: string;
    discapacidadMental: string;
    tipoDiscapacidadMental: string;
    trastornoPsicologico: string;
    tipoTratamiento: string;
  }

@Injectable({
  providedIn: 'root'
})

export class FirestoreService {
  alertController: any;

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router, // Asegúrate de inyectar el enrutador
    private afAuth: AngularFireAuth
  ) { }

// Método para registrar usuario y autenticarlo
async addUser(user: usuario): Promise<void> {
  try {
    // 1. Crear usuario en Firebase Auth
    const userCredential = await this.auth.createUserWithEmailAndPassword(
      user.correo,
      user.contrasena
    );

    if (!userCredential.user) {
      throw new Error('No se pudo crear el usuario en Firebase Auth');
    }

    // 2. Encriptar contraseña para Firestore (opcional, si deseas no almacenar la contraseña en texto claro)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.contrasena, salt);

    // 3. Guardar datos adicionales en Firestore
    const userData = {
      uid: userCredential.user.uid,
      nombre: user.nombre,
      correo: user.correo,
      nombreFamiliar: user.nombreFamiliar,
      numeroFamiliar: user.numeroFamiliar,
      numeroPsico: user.numeroPsico,
      contrasena: hashedPassword // Guardar contraseña encriptada
    };

    // Guardar los datos del usuario en Firestore
    await this.firestore.collection('usuarios').doc(userCredential.user.uid).set(userData);

    // 4. Autenticar al usuario (login automático)
    await this.auth.signInWithEmailAndPassword(user.correo, user.contrasena);

    console.log('Usuario registrado y autenticado exitosamente');
    
  } catch (error) {
    console.error('Error en el registro:', error);
    throw error;
  }
}

  // Método para iniciar sesión
  async validateUser(email: string, password: string): Promise<boolean> {
    try {
      // Iniciar sesión con Firebase Auth
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      
      if (userCredential.user) {
        // Obtener datos adicionales del usuario de Firestore
        const userDoc = await this.firestore
          .collection('usuarios')
          .doc(userCredential.user.uid)
          .get()
          .toPromise();

        if (userDoc?.exists) {
          const userData = userDoc.data() as usuario;
          localStorage.setItem('userName', userData.nombre);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error en la validación:', error);
      return false;
    }
  }

  // Método para obtener el usuario actual
  getCurrentUser(): Observable<any> {
    return this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore
            .collection('usuarios')
            .doc(user.uid)
            .valueChanges();
        }
        return from([null]);
      })
    );
  }

  // Método para obtener el UID del usuario autenticado
  async getCurrentUserId(): Promise<string | null> {
    const user = await this.afAuth.currentUser;  // Obtenemos el usuario actual
    return user ? user.uid : null;  // Si el usuario está autenticado, devolvemos el UID
  }

  // Método para cerrar sesión
  async logout(): Promise<void> {
    try {
      await this.auth.signOut();
      localStorage.removeItem('userName');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  // Método para guardar el formulario de inicio
  async saveFormInicio(formData: formInicio): Promise<void> {
    try {
      const uid = await this.getCurrentUserId();
      if (!uid) {
        throw new Error('Usuario no autenticado');
      }

      const formWithUserId = {
        ...formData,
        uid,
        fechaCreacion: new Date()
      };

      await this.firestore.collection('formInicio').add(formWithUserId);
      console.log('Formulario guardado exitosamente');
    } catch (error) {
      console.error('Error al guardar el formulario:', error);
      throw error;
    }
  }

  // Método para verificar si el usuario ya completó el formulario
  async hasCompletedForm(userId: string): Promise<boolean> {
    try {
      const snapshot = await this.firestore
        .collection('formInicio', ref => 
          ref.where('userId', '==', userId).limit(1)
        )
        .get()
        .toPromise();

      return snapshot ? !snapshot.empty : false;
    } catch (error) {
      console.error('Error al verificar el formulario:', error);
      return false;
    }
  }

    // Método para verificar email
    async getUserByEmail(email: string): Promise<boolean> {
      try {
        const snapshot = await this.firestore
          .collection('usuarios')
          .ref.where('correo', '==', email)
          .get();
        
        return !snapshot.empty; // Retorna true si encuentra el correo
      } catch (error) {
        console.error('Error al verificar correo:', error);
        throw error;
      }
    }

// método para iniciar sesión con Google
async loginWithGoogle(): Promise<boolean> {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const userCredential = await this.auth.signInWithPopup(provider);
    
    if (userCredential.user) {
      // Verificar si el usuario ya existe en Firestore
      const userDoc = await this.firestore
        .collection('usuarios')
        .doc(userCredential.user.uid)
        .get()
        .toPromise();

      if (!userDoc?.exists) {
        // Si el usuario no existe, crear un nuevo documento en Firestore
        const userData = {
          uid: userCredential.user.uid,
          nombre: userCredential.user.displayName,
          correo: userCredential.user.email,
          nombreFamiliar: '',
          numeroFamiliar: '',
          numeroPsico: '',
          authProvider: 'google'
        };

        await this.firestore
          .collection('usuarios')
          .doc(userCredential.user.uid)
          .set(userData);
      }

      // Guardar el nombre del usuario en localStorage
      if (userCredential.user.displayName) {
        localStorage.setItem('userName', userCredential.user.displayName);
      }

      return true;
    }
    return false;
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error);
    return false;
  }
}

    
}