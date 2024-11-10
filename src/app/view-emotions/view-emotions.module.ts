import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewEmotionsPageRoutingModule } from './view-emotions-routing.module';

import { ViewEmotionsPage } from './view-emotions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewEmotionsPageRoutingModule
  ],
  declarations: [ViewEmotionsPage]
})
export class ViewEmotionsPageModule {}
