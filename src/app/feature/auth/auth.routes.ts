import { Routes } from '@angular/router';


export const authRoutes: Routes = [
  {
    path: '',
    loadComponent : ()  => import('./auth').then((c) => c.Authentication),
    children: [
    {path : 'register', loadComponent : () => import('../auth/pages/register/register').then((c) => c.Register)},
    {path : 'login'   , loadComponent : () => import('../auth/pages/login/login').then((c) => c.Login)},
    {path : ''   , redirectTo : 'login' , pathMatch : 'full'}
    ]
  }
];
