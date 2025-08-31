import { Component, computed, inject } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { CartStore } from '../../../store/cart/cart.signal';

@Component({
  selector: 'app-price-summary',
  imports: [SharedModule],
  template: `
   <section aria-label="Section Price Summary" role="section" class="w-full grid grid-cols-1 gap-2">

  <div aria-label="Subtotal and Shipping Order Summary" role="section" 
  class="flex flex-col gap-1 border-b border-b-neutral/50 pb-6">

    <div aria-label="Item Order Summary" role="item" class="flex justify-between items-center">
      <p class="text-sm text-neutral font-semibold">{{'cart.Subtotal' | translate}}</p>
      <span class="text-sm text-neutral">{{cartStore.cartTotal() | currency : 'EGP'}}</span>
    </div>

    <div aria-label="Item Order Summary" role="item" class="flex justify-between items-center">
      <p class="text-sm text-neutral font-semibold">{{'cart.Shipping' | translate}}</p>
      <span class="text-sm text-neutral">{{ shipping() | currency : 'EGP'}}</span>
    </div>

    </div>

    <div aria-label="Total Order Summary" role="item" class="flex justify-between items-center">
      <p aria-label="Title Total Order Summary" role="title" class="text-neutral font-semibold uppercase">
      {{'cart.Total' | translate}}
      </p>
      <span class="text-sm text-neutral font-semibold">{{cartStore.cartTotal() + shipping() | currency : 'EGP'}}</span>
    </div>

  </section>
  `,

})
export class PriceSummary {
  readonly cartStore = inject(CartStore);
  shipping = computed(() => this.cartStore.cartTotal() > 1000 ? 0 : 50);
}
