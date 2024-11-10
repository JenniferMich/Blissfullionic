import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewEmotionsPage } from './view-emotions.page';

const routes: Routes = [
  {
    path: '',
    component: ViewEmotionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewEmotionsPageRoutingModule {}
