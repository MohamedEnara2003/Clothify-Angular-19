import { Routes } from "@angular/router";


export const settingsRoutes: Routes = [
  {
    path: '',
    loadComponent : ()  => import('./ui/settings.component').then((c) => c.SettingsComponent),
    children: [
    {path : 'store' , loadComponent : () => import('./pages/store/ui/setting-store.component')
    .then((c) => c.SettingStoreComponent)
    },
    {path : 'roles' , loadComponent : () => import('./pages/roles/ui/roles.component')
    .then((c) => c.RolesComponent)
    },
    {path : 'shipping' , loadComponent : () => import('./pages/shipping/ui/setting-shipping.component')
    .then((c) => c.SettingShippingComponent)
    },

    {path : '' , redirectTo : '/dashboard/settings/roles' , pathMatch : 'full'},
    {path : '**', redirectTo : '/dashboard/home', pathMatch : 'full'}
    ]
  },
]