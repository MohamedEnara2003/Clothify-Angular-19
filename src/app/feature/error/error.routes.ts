import { Routes } from '@angular/router';



export const errorRoutes: Routes = [
    {
        path: '',
        loadComponent : ()  => import('../error/ui/error.component').then((c) => c.ErrorComponent),
        children: [
        {path : 'not-found' , loadComponent : () => import('./pages/not-found/not-found.component')
        .then((c) => c.NotFoundComponent)
        },
        {path : 'network' , loadComponent : () => import('./pages/network-error/network-error.component')
        .then((c) => c.NetworkErrorComponent)
        },
        {path : 'offline' , loadComponent : () => import('./pages/network-offline/network-offline.component')
        .then((c) => c.NetworkOfflineComponent)
        },
        {path : 'server' , loadComponent : () => import('./pages/server-error/server-error.component')
        .then((c) => c.ServerErrorComponent)
        },

        {path : '' , redirectTo : '/error/not-found' , pathMatch :'full'}
        ],
        
    },
];
