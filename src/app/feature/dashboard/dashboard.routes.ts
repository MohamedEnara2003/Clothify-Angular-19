import { Routes } from '@angular/router';
import { isSuperAdminGuard } from '../../core/guards/is-super-admin.guard';
import { isSuperAdminAndAdminGuard } from '../../core/guards/is-superAdmin-And-admin.guard';


export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent : ()  => import('./dashboard').then((c) => c.Dashboard),
    children: [
      
    {path : 'home',
      loadComponent : () => import('./pages/home/ui/dashboard-home.component')
    .then((c) => c.DashboardHomeComponent)
    },

    {path : 'analytics',
      loadComponent : () => import('./pages/analytics/ui/analytics.component')
    .then((c) => c.AnalyticsComponent)
    },

    {path : 'products', loadComponent : () => import('./pages/products/ui/products').then((c) => c.Products)},
    {path : 'products/upsert-product', canMatch : [isSuperAdminAndAdminGuard] , loadComponent : 
    () => import('./pages/products/pages/upsert-product/ui/upsert-product').then((c) => c.UpsertProduct),
    },

    {path : 'products/upsert-product/:id', canMatch : [isSuperAdminAndAdminGuard] , loadComponent : 
    () => import('./pages/products/pages/upsert-product/ui/upsert-product').then((c) => c.UpsertProduct),
    },

    {path : 'collections', canActivate : [isSuperAdminGuard],
    loadComponent : () => import('./pages/collections/pages/collections-for-home.component'
    ).then((c) => c.CollectionsForHomeComponent)},

    {path : 'collections/upsert-collection', canActivate : [isSuperAdminGuard],
      loadComponent : () => import('./pages/collections/pages/collections-form.component'
    ).then((c) => c.CollectionsFormComponent)},

    {path : 'collections/upsert-collection/:id', canActivate : [isSuperAdminGuard],
    loadComponent : () => import('./pages/collections/pages/collections-form.component'
    ).then((c) => c.CollectionsFormComponent)},

    {path : 'orders', loadComponent : () => import('./pages/orders/ui/orders').then((c) => c.Orders)},
    {path : 'users' , loadComponent : () => import('./pages/users/ui/users').then((c) => c.Users)},

    {path : 'settings' , canActivate : [isSuperAdminGuard],
    loadChildren : () => import('./pages/settings/settings.routes').then((r) => r.settingsRoutes)
    },


    {path : '' , redirectTo : '/dashboard/home' , pathMatch : 'full'},
    {path : '**', redirectTo : '/dashboard/home', pathMatch : 'full'}
    ],
    
  },
  
];
