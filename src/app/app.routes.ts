import { Routes } from '@angular/router';
import { isAdminGuard } from './core/guards/is-admin.guard';


export const routes: Routes = [
{
    path: 'dashboard', canMatch : [isAdminGuard] ,
    loadChildren: () => import('./feature/dashboard/dashboard.routes').then((r) => r.dashboardRoutes)
},
{
    path: 'main',
    loadChildren: () => import('./feature/main/main.routes').then((r) => r.mainRoutes)
},
{
    path: 'checkout',
    loadComponent: () => import('./feature/checkout/ui/checkout').then((c) => c.Checkout),
},
{
    path: 'error',
    loadChildren: () => import('./feature/error/error.routes').then((r) => r.errorRoutes)
},
{
    path: 'auth',
    loadChildren: () => import('./feature/auth/auth.routes').then((r) => r.authRoutes)
},

{path: '' , redirectTo: 'main', pathMatch: 'full'},
{path : '**', redirectTo : '/error/not-found', pathMatch : 'full'}
];
