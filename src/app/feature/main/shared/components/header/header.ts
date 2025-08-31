import { Component, signal } from '@angular/core';
import { Logo } from "../../../../../shared/components/logo/logo";
import { UserProfile } from "../../../../../shared/components/user-profile/user-profile";
import { WishlistLink } from "../links/wishlist-link/wishlist-link";
import { CartLink } from "../links/cart-link/cart-link";
import { OrderLink } from "../links/order-link/order-link";
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { MainAside } from "../navigations/main-aside/main-aside";
import { SelectLangComponent } from "../../../../../shared/components/translation/select-lang.component";
import { SearchInputComponent } from "../../../../../shared/components/search-input/search-input.component";
import { SearchBarAsideComponent } from "../navigations/search-bar-aside/search-bar-aside.component";


@Component({
  selector: 'app-header',
  imports: [Logo, UserProfile, WishlistLink, CartLink, OrderLink, SharedModule, MainAside, SelectLangComponent, SearchInputComponent, SearchBarAsideComponent],
  template: `

  <section class="w-full">
  <header id="header" aria-label="Main Header" role="heading" 
  class="w-full flex justify-between items-center bg-neutral  p-4 px-4 md:px-8 ">
    
    <div class="flex justify-center items-center gap-4">
    <button type="button" aria-label="Menu Button" role="button" 
    class="cursor-pointer text-neutral-content  hover:text-secondary duration-300 transition-colors"
    (click)="isOpenMainAside.set(!isOpenMainAside())">
    <span class="material-icons" style="font-size: 1.7rem;">notes</span>
    </button>
  
    <app-search-input class="bg-neutral-200 hidden md:block" (click)="isOpenSearchBarAside.set(true)"/>

    <button type="button" aria-label="Menu Button" role="button" 
    class="cursor-pointer md:hidden text-neutral-content  hover:text-secondary duration-300 transition-colors"
    (click)="isOpenSearchBarAside.set(true)">
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



 @if(isOpenMainAside()) {
    <app-main-aside [isOpenMainAside]="isOpenMainAside()"  (isOpenMainAsideChange)="isOpenMainAside.set($event)" />
  }
 @if(isOpenSearchBarAside()) {
    <app-search-bar-aside  
    [isOpenSearchBarAside]="isOpenSearchBarAside()"  
    (isOpenSearchBarAsideChange)="isOpenSearchBarAside.set($event)" />
  }

  </section>
  `,
})
export class Header {
  isOpenMainAside = signal<boolean>(false);
  isOpenSearchBarAside = signal<boolean>(false);
}
