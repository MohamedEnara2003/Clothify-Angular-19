import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { PriceSummary } from "../../../shared/components/price-summary/price-summary";
import { SharedModule } from '../../../shared/modules/shared.module';
import { CartStore } from '../../../store/cart/cart.signal';
import { NgImageComponent } from "../../../shared/components/ng-image/ng-image.component";

@Component({
  selector: 'app-order-details',
  imports: [PriceSummary, SharedModule, NgImageComponent],
  template: `

 <article aria-label="Order Details" class="w-full border border-neutral-content rounded p-6 grid gap-2">

  <!-- Header -->
  <header class="flex justify-between items-center">
    <h2 class="text-lg font-semibold text-neutral uppercase">
      {{ 'orders.Your Orders' | translate }}
    </h2>
    <div class="flex items-center gap-2">
      <span class="text-secondary font-bold">({{ cartStore.cartCount() }})</span>
      <button
        type="button"
        class="btn btn-circle btn-sm md:hidden"
        (click)="isOpen.set(!isOpen())"
        aria-label="Toggle Orders List"
      >
        <span
          class="material-icons transition-all duration-300"
          style="font-size: 2rem;"
          [ngClass]="isOpen() ? 'rotate-180' : ''"
        >
          keyboard_arrow_up
        </span>
      </button>
    </div>
  </header>

  <!-- Main -->
  @if (isOpen()) {
    <main
      [attr.aria-hidden]="!isOpen()"
      class="grid gap-2 duration-500 transition-all overflow-hidden"
      [ngClass]="{ 'animate-down': isOpen() }"
    >
      <!-- Products List -->
      <ul
        class="h-70 overflow-y-auto flex flex-col gap-5 text-neutral border-b border-b-neutral/50 pb-6"
        style="scrollbar-width: none;"
      >
        @for (product of cartStore.userCart()?.products; let i = $index ; track product.productId?._id) {
          @let selectedSize = product.selectedSize;

          <li class="flex items-center gap-2 h-30">
            
        <!-- Image -->
        <app-ng-image
        [options]="{
        src : product.productId.images[0].img_url,
        alt : 'Product Image ' + (i + 1),
        width :  250 , 
        height : 250 ,
        class : 'w-[40%] h-full p-1 border border-neutral-content rounded object-contain' ,
        loading : 'lazy' ,
        decoding : 'async'
        }"
        />

            <!-- Details -->
            <section class="flex flex-col justify-around gap-1 flex-1">
              
              <!-- Name & Change Link -->
              <header class="flex justify-between items-center">
                <p class="text-sm font-bold line-clamp-1 capitalize">
                  {{ product.productId.name }}
                </p>
                <a
                  [routerLink]="['/main/cart']"
                  [queryParams]="{ id: product.productId._id, size_id: selectedSize?.size_id || null }"
                  class="text-sm link link-neutral hover:text-secondary transition-colors duration-300"
                >
                  {{ 'Change' | translate }}
                </a>
              </header>

              <!-- Color / Size / Qty -->
              <p class="flex gap-1">
                <span class="capitalize line-clamp-1">{{ product.productId.color }}</span> /
                @if (selectedSize) {
                  <span>{{ selectedSize.size }}</span> /
                }
                <span>{{ product.quantity }}</span>
              </p>

              <!-- Price -->
              <footer class="flex justify-between items-center font-bold text-secondary">
                <span>({{ product.quantity }})</span>
                <span>{{ product.productId.final_price | currency: 'EGP' }}</span>
              </footer>

            </section>
          </li>
        }
      </ul>

      <!-- Price Summary -->
      <app-price-summary />
    </main>
  }
</article>

  `,
  styles: ``
})
export class OrderDetails  implements OnInit{
  isOpen = signal<boolean>(true);
  readonly cartStore = inject(CartStore);
  
  constructor(){
  this.cartStore.getUserCart();
  }

  @HostListener('window:resize')
    onResize() {
    this.isOpen.set(window.innerWidth > 768);
    };

  ngOnInit() {
    this.onResize();
  }
}
