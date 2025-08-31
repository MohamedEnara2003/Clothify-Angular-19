import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppLinksService {

  profileLinks : Signal<{name : string , path : string , icon : string}[]> = signal([
    {name : 'Home' , path : '/main/home' , icon : 'home'},
    {name : 'Collections' , path : '/main/collections' , icon : 'store'},
    {name : 'Cart' , path : '/main/cart' , icon : 'shopping_cart'},
    {name : 'Orders' , path : '/main/orders' , icon : 'shopping_bag'},
    {name : 'Wishlist' , path : '/main/wishlist' , icon : 'favorite_outline'},
  ]);

  socialMedia : Signal<{name : string , path : string , icon : string}[]>= signal([

  ])
  
}

