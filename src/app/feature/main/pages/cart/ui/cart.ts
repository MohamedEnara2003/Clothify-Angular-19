import { Component , effect, inject, signal,  } from '@angular/core';
import { OrderSummaryCard } from "../components/order-summary-card";
import { CartCard } from "../components/cart-card";
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { ModelUpdateSizeAndQuantity } from "../components/model-update-size-and-quantity";
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { LoadingSpinner } from "../../../shared/components/loading/loading-spinner";
import { CartStore } from '../../../../../store/cart/cart.signal';
import { UserActivityHeaderComponent } from "../../../shared/components/user-activity-header/user-activity-header.component";
import { MsgEmptyComponent } from "../../../shared/components/msg-empty/msg-empty.component";

@Component({
  selector: 'app-cart',
  imports: [
  OrderSummaryCard,
  CartCard,
  ModelUpdateSizeAndQuantity,
  SharedModule,
  LoadingSpinner,
  UserActivityHeaderComponent,
  MsgEmptyComponent],
  template: `
  <section aria-label="Section Cart" role="section" class="w-full grid grid-cols-1 gap-5 ">
  <app-user-activity-header [title]="'cart.Shopping Cart' | translate" [count]="cartStore.cartCount()" />

    @if (cartStore.isLoading()) {
    <app-loading-spinner class="h-80" />
    }@else if (cartStore.cartCount() === 0) {
    <app-msg-empty [msg]="'cart.Your cart is empty!' | translate" />
    }
    @else {
    <main aria-label="Main Cart" role="main" 
    class="w-full flex flex-col md:flex-row justify-center items-center md:items-start gap-5 ">
      <app-cart-card
      [cart]="cartStore.userCart()!" 
      class="w-full "/>
      <app-order-summary-card class="w-full md:w-[50%] lg:w-[40%] "/>
    </main>

    @if (productId() || sizeId()) {
    <app-model-update-size-and-quantity />   
    }

    }
  </section>
  `,
})
export class CartComponent {
  private activatedRoute = inject(ActivatedRoute);
  readonly cartStore = inject(CartStore);

  productId = signal<string | null>(null);
  sizeId = signal<string | null>(null);

  constructor() {
    this.cartStore.getUserCart();
    this.getProductId();

    effect(() => {
      const productId = this.productId()
      const sizeId = this.sizeId()
      if(productId){
      return this.cartStore.getUserCartProduct(productId , sizeId);
      }
      this.cartStore.removeUserCartProduct();
    })

  }

  private getProductId() : void {
        this.activatedRoute.queryParamMap.pipe(
        tap((qurtyParam) =>  {
          const productId = qurtyParam.get('id');
          const sizeId = qurtyParam.get('size_id') ;

          this.productId.set(productId)
          this.sizeId.set(sizeId)
        }),
        takeUntilDestroyed(),
  ).subscribe();
  };


}
