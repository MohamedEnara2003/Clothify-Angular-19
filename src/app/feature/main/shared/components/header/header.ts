import { Component } from '@angular/core';
import { Logo } from "../../../../../shared/components/logo/logo";
import { UserProfile } from "../../../../../shared/components/user-profile/user-profile";
import { WishlistLink } from "../links/wishlist-link/wishlist-link";
import { CartLink } from "../links/cart-link/cart-link";
import { OrderLink } from "../links/order-link/order-link";
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { SelectLangComponent } from "../../../../../shared/components/translation/select-lang.component";


@Component({
  selector: 'app-header',
  imports: [
  Logo, UserProfile, WishlistLink, CartLink, OrderLink, SharedModule, 
  SelectLangComponent,
  ],
  template: `

  <section class="w-full">
  <header id="header" aria-label="Main Header" role="heading" 
  class="w-full flex justify-between items-center bg-neutral  p-4 px-4 md:px-8 ">
    
    <div class="flex justify-center items-center gap-4">
      
    <button [routerLink]="['/main' ,{outlets : {
    aside : 'menu' ,
    }}]" type="button" aria-label="Menu Button" role="button" 
    class="cursor-pointer text-neutral-content  hover:text-secondary duration-300 transition-colors">
    <span class="material-icons" style="font-size: 1.7rem;">notes</span>
    </button>
  

    <button [routerLink]="['/main' ,{outlets : {
    aside : 'search' ,
    }}]" type="button" aria-label="Menu Button" role="button" 
    class="cursor-pointer text-neutral-content  hover:text-secondary duration-300 transition-colors">
    <span class="material-icons" style="font-size: 1.7rem;">search</span>
    </button>
    </div>

    
    <app-logo  class="absolute left-1/2 -translate-x-1/2"/>
    
    <nav aria-label="Header Navigation Links" role="navigation" class="flex justify-center gap-4">
    <app-select-lang class="hidden md:inline-block"/>

    <ul aria-label="Header Navigation Links" role="list" class="flex justify-center gap-4">
    <li aria-label="Wishlist Link" role="listitem" class="hidden md:block">
      <app-wishlist-link/>
    </li>
    <li aria-label="Cart Link" role="listitem" class="hidden md:block">
      <app-cart-link/>
    </li>
    <li aria-label="Order Link" role="listitem">
      <app-order-link/>
    </li>
    </ul>

    <app-user-profile />
    </nav>
    </header>



  </section>
  `,
})
export class Header {

}
