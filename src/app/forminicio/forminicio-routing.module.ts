import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForminicioPage } from './forminicio.page';

const routes: Routes = [
  {
    path: '',
    component: ForminicioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForminicioPageRoutingModule {}
