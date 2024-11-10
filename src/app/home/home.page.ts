import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../SERVICES/firestore.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})


export class HomePage implements OnInit {
  uid: string | null = '';
  userName: string = 'User';

  constructor(
    private firestoreService: FirestoreService, 
    private router: Router,
    private afAuth: AngularFireAuth,)
  {}

  ngOnInit() {
    this.firestoreService.getCurrentUser().subscribe(userData => {
      if (userData) {
        this.userName = userData.nombre || 'User';
      }
    });

    this.afAuth.authState.subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
      }
    });

  }

  // Método para cerrar sesión
  async onLogout() {
    try {
      await this.firestoreService.logout();
      this.router.navigate(['/login'], { replaceUrl: true });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}




