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
    loadChildren: () => import('./screens/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./screens/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'mainscreen',
    loadChildren: () => import('./screens/mainscreen/mainscreen.module').then( m => m.MainscreenPageModule)
  },
  {
    path: 'accountinfo',
    loadChildren: () => import('./screens/accountinfo/accountinfo.module').then( m => m.AccountinfoPageModule)
  },
  {
    path: 'newsub',
    loadChildren: () => import('./screens/newsub/newsub.module').then( m => m.NewsubPageModule)
  },
  {
    path: 'newentry',
    loadChildren: () => import('./screens/newentry/newentry.module').then( m => m.NewentryPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
