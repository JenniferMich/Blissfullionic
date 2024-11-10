import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForminicioPageRoutingModule } from './forminicio-routing.module';

import { ForminicioPage } from './forminicio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ForminicioPageRoutingModule
  ],
  declarations: [ForminicioPage]
})
export class ForminicioPageModule {}
