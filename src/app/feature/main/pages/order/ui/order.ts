import { Component, inject,  } from '@angular/core';
import { OrderStore } from '../../../../../store/orders/orders.signal';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { LoadingSpinner } from "../../../shared/components/loading/loading-spinner";
import { MsgEmptyComponent } from "../../../shared/components/msg-empty/msg-empty.component";
import { UserActivityHeaderComponent } from "../../../shared/components/user-activity-header/user-activity-header.component";
import { OrderCardComponent } from "../components/order-card.component";

@Component({
  selector: 'app-order',
  imports: [SharedModule, LoadingSpinner, MsgEmptyComponent, UserActivityHeaderComponent, OrderCardComponent],
  template: `
  <section aria-label="Orders Page" role="section" class="w-full grid grid-cols-1 gap-5">

  <app-user-activity-header [title]="'orders.Orders' | translate" [count]="orderStore.userOrderCount()" />

@let isLoading = orderStore.isLoading();
@let userOrder = orderStore.userOrder();
@let orderCount = orderStore.userOrderCount();

@if (isLoading) {<app-loading-spinner class="h-80" />}
@else if (orderCount === 0) {<app-msg-empty [msg]="'orders.No orders found' | translate" />}
@else if (userOrder) {
<ul role="list" class="w-full grid grid-cols-1 gap-10">
    @for (order of userOrder.orders; track order._id) {
      <li role="listitem" class="w-full list-none">
      @defer (on viewport) {
      <app-order-card [user]="{ order, userId: userOrder.userId }" />
      }@placeholder {
      <div class="w-full h-100 bg-neutral-300 animate-pulse"></div>
      }
      </li>
    }
</ul>
}

  </section>
  `,
})
export class Order {
  readonly orderStore = inject(OrderStore)

  constructor(){
  this.orderStore.getUserOrder()
  }


}
