import { Component, computed, inject, input, signal } from '@angular/core';
import { Order } from '../../../../../core/interfaces/order.interface';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { OrderStore } from '../../../../../store/orders/orders.signal';
import { ConfirmPopupService } from '../../../../../core/services/confirm-popup.service';
import { OrderInfoComponent } from "./order-info.component";
import { OrderReceiptComponent } from "./order-receipt.component";
import { NgImageComponent } from "../../../../../shared/components/ng-image/ng-image.component";

@Component({
  selector: 'app-order-card',
  imports: [SharedModule, OrderInfoComponent, OrderReceiptComponent, NgImageComponent],
  template: `
<article
  class="relative card w-full text-neutral"
  itemscope
  itemtype="https://schema.org/Order"
  [ngClass]="{
    'border border-neutral/30 hover:shadow shadow-neutral duration-300 transition-all': !isHide()
  }"
  role="region"
  aria-label="Order Details"
>
  <div class="card-body p-3 sm:p-5">
    <!-- Header -->
    <header
      class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 justify-between font-bold border-b border-neutral/50 pb-2"
    >
      <section class="grid grid-cols-1 gap-1 text-base sm:text-lg">
        <h1 class="text-xl font-bold flex items-center gap-2" itemprop="orderNumber">
          {{ 'orderCard.Order' | translate }} :
          <span class="text-secondary break-all">#{{ userOrder()._id }}</span>
        </h1>

        <p class="text-lg flex items-center gap-2">
          {{ 'orderCard.Order Date' | translate }} :
          <time
            class="text-secondary"
            itemprop="orderDate"
            [attr.datetime]="userOrder().createdAt | date:'yyyy-MM-ddTHH:mm:ss'"
          >
            {{ userOrder().createdAt | date:'yyyy-MM-ddTHH:mm:ss' }}
          </time>
        </p>

        <p class="text-base flex items-center gap-2">
          {{ 'orderCard.Payment Method' | translate }}:
          <span class="text-secondary" itemprop="paymentMethod">
            {{ userOrder().paymentMethod || 'N/A' }}
          </span>
        </p>

        <p class="text-base flex items-center gap-2">
          {{ 'orderCard.Status' | translate }}:
          <span
            class="font-extrabold badge shadow shadow-neutral"
            itemprop="orderStatus"
            [ngClass]="{
              'badge-success': userOrder().orderStatus === 'Accepted',
              'badge-info': userOrder().orderStatus === 'Pending',
              'badge-warning': userOrder().orderStatus === 'Shipped',
              'badge-secondary': userOrder().orderStatus === 'Delivered',
              'badge-error': userOrder().orderStatus === 'Cancelled'
            }"
          >
            {{ 'orderCard.' + userOrder().orderStatus | translate }}
          </span>
        </p>
      </section>

      <!-- Actions -->
      <nav
        class="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-0"
        aria-label="Order Actions"
      >
        @if(userOrder().receipt) {
          <button
            type="button"
            class="btn btn-outline btn-secondary w-full sm:w-auto"
            (click)="isLoadReceipt.set(true)"
            aria-label="Show Receipt"
          >
            {{ 'orderCard.Show receipt' | translate }}
          </button>
        }
        <button
          type="button"
          class="btn btn-secondary w-full sm:w-auto"
          (click)="isLoadTrackOrder.set(true)"
          aria-label="Track Order"
        >
          {{ 'orderCard.Track Order' | translate }}
        </button>
      </nav>
    </header>

    <!-- Order Items -->
    <section class="w-full grid grid-cols-1 gap-1 mt-2" aria-label="Order Items">
      <h2 class="text-lg font-bold p-1">
        {{ 'orderCard.Order Items' | translate }} ({{ orderItemsCount() }})
      </h2>

      <ul
        class="w-full  max-h-35 sm:max-h-30 grid grid-cols-1 gap-4 items-start overflow-y-auto"
        role="list"
      >
        @for (product of userOrder().products; let i = $index;  track product.productId._id){
          <li
            class="w-full flex flex-col sm:flex-row items-start sm:items-center relative duration-300 
            transition-all justify-between gap-2 rounded p-2"
            role="listitem"
          >
            <!-- Product Info -->
          <section class="flex items-center gap-2 w-full sm:w-auto">

          <app-ng-image
                [options]="{
                src : product.productId.images[0].img_url,
                alt : product.productId.name ,
                placeholder : product.productId.images[1].img_url,
                width : 96 ,
                height : 96 ,
                class : 'size-full object-contain' ,
                loading : i === 0 ? null : 'lazy' ,
                decoding : 'async'
                }"
                class="size-20 sm:size-24 border border-neutral/20 rounded shrink-0"
            />

              <section class="flex flex-col gap-1 w-full">
                <h3
                  class="text-base sm:text-lg font-bold capitalize break-words"
                  itemprop="name"
                >
                  {{ product.productId.name }}
                </h3>
                <p
                  class="text-neutral/70 font-semibold flex flex-wrap items-center gap-2 sm:gap-4"
                >

                @let selectedSize = product.selectedSize ;
                @if(selectedSize){
                <span>
                    {{ 'orderCard.Size' | translate }}: {{selectedSize.size }}
                  </span>
                }
          
                  <span>
                    {{ 'orderCard.Qty' | translate }}: {{ product.quantity }}
                  </span>
                  <span class="text-base sm:text-lg text-neutral font-bold">
                    {{ 'orderCard.Price' | translate }}:
                    {{ product.productId.final_price | currency: 'EGP' }}
                  </span>

                    <span class="badge badge-success z-10">
                      {{ 'orderCard.ReadyForSale' | translate }}
                    </span>
                  
                </p>
              </section>
            </section>

          </li>
        }
      </ul>
    </section>

    <!-- Footer -->
    <footer
    class="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t 
    border-neutral/50"
    >
      <p
        class="text-base sm:text-xl text-neutral flex items-center gap-2 font-bold"
        aria-label="Total Price"
      >
        {{ 'orderCard.Total Price' | translate }}:
        <span class="text-secondary">
          {{ userOrder().totalPrice | currency: 'EGP' }}
        </span>
      </p>

      @if (userOrder().orderStatus === 'Pending' && !isHide()) {
        <button
          type="button"
          aria-label="Cancel Order"
          class="btn btn-outline btn-error w-full sm:w-auto"
          (click)="cancelOrder()"
        >
          {{ 'orderCard.Cancel Order' | translate }}
        </button>
      }
    </footer>
  </div>

  <!-- Track Order -->
  @if(isLoadTrackOrder()) {
    <app-order-info
      [userData]="userOrder().userData!"
      [isLoad]="isLoadTrackOrder()"
      (isLoadChange)="isLoadTrackOrder.set($event)"
    />
  }

  <!-- Receipt -->
  @let receipt = userOrder().receipt;
  @if(isLoadReceipt() && receipt) {
    <app-order-receipt
      [receipt]="receipt"
      [isLoad]="isLoadReceipt()"
      (isLoadChange)="isLoadReceipt.set($event)"
    />
  }
</article>

  `,
})
export class OrderCardComponent {
  isHide = input<boolean>(false);

  user = input.required<{order : Order , userId : string}>();

  userId =  computed<string>(() => this.user().userId);
  userOrder = computed<Order>(() => this.user().order);
  
  isLoadTrackOrder = signal<boolean>(false);
  isLoadReceipt = signal<boolean>(false);

  readonly orderStore = inject(OrderStore)
  readonly confirmPopupService = inject(ConfirmPopupService)
  
  orderItemsCount = computed(() => this.userOrder().products.length)

  cancelOrder() : void {
    this.confirmPopupService.confirm({
      message: 'cancelOrderMsg',
      icon: 'info',
      accept: () => {
      const orderId = this.userOrder()._id!;
      if(!orderId) return;
      this.orderStore.updateOrderStatus(orderId , this.userId(), 'Cancelled');
      },
      reject: () => {}
    })
  }
  



}