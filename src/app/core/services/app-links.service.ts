import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppLinksService {

  profileLinks : Signal<{id : number , name : string , path : string , icon : string}[]> = signal([
    {id : 1 , name : 'Home' , path : '/main/home' , icon : 'home'},
    {id : 2 , name : 'Collections' , path : '/main/collections' , icon : 'store'},
    {id : 3 , name : 'Cart' , path : '/main/cart' , icon : 'shopping_cart'},
    {id : 4 , name : 'Orders' , path : '/main/orders' , icon : 'shopping_bag'},
    {id : 5 , name : 'Wishlist' , path : '/main/wishlist' , icon : 'favorite_outline'},
  ]);

  
}

