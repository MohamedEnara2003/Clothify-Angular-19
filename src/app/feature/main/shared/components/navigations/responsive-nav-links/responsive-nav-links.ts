import { Component, signal } from '@angular/core';
import { WishlistLink } from "../../links/wishlist-link/wishlist-link";
import { CartLink } from "../../links/cart-link/cart-link";
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { fromEvent, map, pairwise, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-responsive-nav-links',
  imports: [WishlistLink, CartLink , SharedModule],
  template: `
  @if (isScroll()) {
    <nav aria-label="Responsive Navigation Links" role="navigation"
    class="animate-up fixed bottom-0 left-0 right-0 bg-secondary-content p-1 shadow shadow-neutral z-30
    md:hidden">
    <ul 
    aria-label="Responsive Navigation Links"
    role="list"
    class="flex justify-around items-center text-neutral text-xs" >
      <li aria-label="Home" role="listitem">
        <a href="/main/home" routerLink="/main/home" 
        class="flex flex-col items-center hover:text-secondary"
        routerLinkActive="text-secondary">
          <span class="material-icons-outlined" style="font-size: 1.8rem;"> home </span>
          <span aria-hidden="true" >{{'navigation.Home' | translate}}</span>
        </a>
      </li>
      <li>
        <a href="/search" routerLink="/main/search" class="flex flex-col items-center"
        routerLinkActive="text-secondary">
          <span class="material-icons" style="font-size: 1.8rem;"> search </span>
          <span aria-hidden="true" >{{'common.Search' | translate}}</span>
        </a>
      </li>
      <li aria-label="Collections" role="listitem">
        <a href="/main/collections" routerLink="/main/collections" class="flex flex-col items-center"
        routerLinkActive="text-secondary">
          <span class="material-icons-outlined" style="font-size: 1.8rem;"> view_cozy </span>
          <span aria-hidden="true" >{{'navigation.Collections' | translate}}</span>
        </a>
      </li>
      <li aria-label="Wishlist" role="listitem">
      <app-wishlist-link/>
      </li>
      <li>
      <app-cart-link/>
      </li> 
    </ul>
 </nav>
  
  <a [routerLink]="[]" 
  aria-label="Scroll to top of page" role="link"
  class="animate-sideRight btn btn-sm sm:btn-md btn-square btn-neutral fixed bottom-18 md:bottom-10 right-2 z-30 shadow shadow-neutral text-xl transition hover:scale-110 duration-200">
  <i class="material-icons">arrow_upward</i>
  </a>
   }
  `,
})
export class ResponsiveNavLinks {
  
  isScroll = signal(true);
  
  constructor(){this.handleScrolling();}

  private handleScrolling() : void {
  fromEvent(window , 'scroll').pipe(
  map(() => window.scrollY),
  pairwise(),
  tap(([a , b]) => this.isScroll.set(a > b || a < 50 && b < 50 ? true : false)),
  takeUntilDestroyed()
  ).subscribe();
  }

 
}
