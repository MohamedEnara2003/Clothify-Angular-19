import { Component, inject } from '@angular/core';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { CartStore } from '../../../../../../store/cart/cart.signal';


@Component({
  selector: 'app-cart-link',
  imports: [SharedModule],
  template: `
    <a [title]="'links.cart' | translate" aria-label="Cart Link" role="link" href="/main/cart" routerLink="/main/cart" 
    class="text-neutral md:text-neutral-content flex flex-col items-center relative" 
    routerLinkActive="text-secondary md:text-secondary">
      <span class="material-icons-outlined" style="font-size: 1.8rem;"> shopping_cart </span>
      <span aria-hidden="true" class="md:hidden">{{ 'links.cart' | translate }}</span>
      <span class="badge badge-xs  badge-secondary size-5 absolute -top-2 -right-2">
        {{cartStore.cartCount()}}
      </span>
    </a>
  `,
})
export class CartLink {
  readonly cartStore = inject(CartStore);

  constructor(){
  this.cartStore.getUserCart();
  }
}
