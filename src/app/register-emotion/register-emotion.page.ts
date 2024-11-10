import { Component } from '@angular/core';

@Component({
  selector: 'app-register-emotion',
  templateUrl: './register-emotion.page.html',
  styleUrls: ['./register-emotion.page.scss'],
})
export class RegisterEmotionPage {
  mood: string = '';
  notes: string = '';

  constructor() {}

  saveEmotion() {
    const currentDate = new Date().toLocaleDateString();
    const emotionEntry = {
      date: currentDate,
      mood: this.mood,
      notes: this.notes
    };

    // Obtener las emociones guardadas en localStorage
    const emotions = JSON.parse(localStorage.getItem('emotions') || '[]');
    emotions.push(emotionEntry);

    // Guardar de nuevo en localStorage
    localStorage.setItem('emotions', JSON.stringify(emotions));

    // Limpiar los campos
    this.mood = '';
    this.notes = '';

    alert('Emoción guardada con éxito');
  }
}
