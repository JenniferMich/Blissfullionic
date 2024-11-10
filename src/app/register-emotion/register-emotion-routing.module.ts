import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterEmotionPage } from './register-emotion.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterEmotionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterEmotionPageRoutingModule {}
