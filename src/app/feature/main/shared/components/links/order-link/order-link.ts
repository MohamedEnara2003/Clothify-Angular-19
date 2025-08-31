import { Component, inject } from '@angular/core';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { OrderStore } from '../../../../../../store/orders/orders.signal';

@Component({
  selector: 'app-order-link',
  imports: [SharedModule],
  template: `
    <a [title]="'dashboard.Orders' | translate" aria-label="Orders Link" role="link" href="/main/orders" routerLink="/main/orders" 
    class="text-neutral-content flex flex-col items-center relative" >
      <span class="material-icons-outlined" routerLinkActive="text-secondary" style="font-size: 1.8rem;"> 
        shopping_basket 
      </span>
      <span class="badge badge-xs badge-secondary size-5 absolute -top-2 -right-2">
      {{orderStore.userOrder()?.orders?.length || 0}}
      </span>
    </a>
  `,
})
export class OrderLink {
  readonly orderStore = inject(OrderStore);

  constructor(){
  this.orderStore.getUserOrder();
  }
}
