import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
 
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'forminicio/:uid', // Incluye el "/" antes de :uid
    loadChildren: () => import('./forminicio/forminicio.module').then(m => m.ForminicioPageModule)
  },   {
    path: 'register-emotion',
    loadChildren: () => import('./register-emotion/register-emotion.module').then( m => m.RegisterEmotionPageModule)
  },
  {
    path: 'view-emotions',
    loadChildren: () => import('./view-emotions/view-emotions.module').then( m => m.ViewEmotionsPageModule)
  }
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
