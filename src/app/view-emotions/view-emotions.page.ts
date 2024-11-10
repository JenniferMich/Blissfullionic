import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-emotions',
  templateUrl: './view-emotions.page.html',
  styleUrls: ['./view-emotions.page.scss'],
})
export class ViewEmotionsPage implements OnInit {
  emotions: any[] = [];

  constructor() {}

  ngOnInit() {
    this.loadEmotions();
  }

  ionViewWillEnter() {
    this.loadEmotions();
  }

  loadEmotions() {
    const storedEmotions = JSON.parse(localStorage.getItem('emotions') || '[]');
    this.emotions = storedEmotions;
  }
}
