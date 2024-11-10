import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterEmotionPageRoutingModule } from './register-emotion-routing.module';

import { RegisterEmotionPage } from './register-emotion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterEmotionPageRoutingModule
  ],
  declarations: [RegisterEmotionPage]
})
export class RegisterEmotionPageModule {}
