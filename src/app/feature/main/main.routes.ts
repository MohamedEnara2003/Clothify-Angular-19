import { Routes } from '@angular/router';



export const mainRoutes: Routes = [
  {
    path: '',
    loadComponent : ()  => import('./main').then((c) => c.Main),
    children: [
      
    {path: 'home', loadComponent: () => import('./pages/home/ui/home').then((c) => c.Home)},

    {path: 'collections', 
    loadComponent: () => import('./pages/products/pages/products/ui/products').then((c) => c.Products)
    },
    {path: 'products/:id', 
    loadComponent: () => import('./pages/products/pages/product-details/ui/product-details')
    .then((c) => c.ProductDetails) 
    },
    {path: 'cart', loadComponent: () => import('./pages/cart/ui/cart').then((c) => c.CartComponent)},
    {path: 'wishlist', loadComponent: () => import('./pages/wishlist/ui/wishlist.component').then((c) => c.WishlistComponent)},
    {path: 'orders', loadComponent: () => import('./pages/order/ui/order').then((c) => c.Order)},

    { 
    path: 'menu',
    loadComponent: () => import('./shared/components/navigations/main-aside/main-aside').then(c => c.MainAside),
    outlet: 'aside'
    },

    {path: 'search', 
    loadComponent: () => import('./shared/components/navigations/search-bar-aside/search-bar-aside.component')
    .then((c) => c.SearchBarAsideComponent),
    outlet : 'aside' ,
    },
  
    {path : '', redirectTo : 'home', pathMatch : 'full'},
    {path : '**', redirectTo : '/error/not-found', pathMatch : 'full'}
    ],
  },
  

];
