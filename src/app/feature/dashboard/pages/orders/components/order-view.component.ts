import { Component, inject, model, signal } from '@angular/core';
import { Order, OrderStatus } from '../../../../../core/interfaces/order.interface';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { OrderCardComponent } from "../../../../main/pages/order/components/order-card.component";
import { ConfirmPopupService } from '../../../../../core/services/confirm-popup.service';
import { OrderStore } from '../../../../../store/orders/orders.signal';

@Component({
  selector: 'app-order-view',
  imports: [SharedModule, OrderCardComponent],
  template: `
  <section class="w-full h-svh fixed top-0 left-0 flex justify-center items-center z-20">

  <article class="w-5xl bg-white z-20 grid grid-cols-1 gap-2 animate-up">

  <header class="w-full p-2  flex items-center">
  <button (click)="orderView.set(null)" type="button" class="material-icons btn btn-circle">close</button>
  </header>

  <app-order-card [user]="orderView()!"  [isHide]="true"
  class="relative  bg-white " />

  <nav class="w-full">
  <ul class="w-full grid grid-cols-5 ">
  @for (status of orderStatus(); track status) {
  <li>
  <button [title]="'dashboard.' + status | translate" type="button" 
  class="w-full  btn btn-sm md:btn-md xl:btn-lg  hover:bg-transparent 
  font-bold rounded-none uppercase duration-500 transition-all" 
    [ngClass]="{
            'btn-info': status === 'Pending',
            'btn-success': status === 'Accepted',
            'btn-warning': status === 'Shipped',
            'btn-secondary hover:text-secondary':status === 'Delivered',
            'btn-error':  status=== 'Cancelled',
            'btn-outline' : status === orderView()?.order?.orderStatus
      }" (click)="confirmUpdateOrderStatus( orderView()?.order?._id! , orderView()?.userId! , status)"
      [disabled]="status === orderView()?.order?.orderStatus">
      {{'dashboard.' + status | translate}}
    </button>
  </li>
  }
  </ul>
  </nav>
  </article>

  <div (click)="orderView.set(null)" class="size-full fixed top-0 left-0 bg-neutral/70 z-10"></div>
  </section>
  `,
  styles: ``
})
export class OrderViewComponent {
  private readonly confirmPopupService = inject(ConfirmPopupService);
  private readonly orderStore = inject(OrderStore);
  
  orderView = model<{order : Order , userId : string } | null>();

  orderStatus = signal<OrderStatus[]>
  (['Pending' , 'Accepted' , 'Shipped' , 'Delivered' , 'Cancelled' ])
  .asReadonly();


  confirmUpdateOrderStatus(orderId: string , userId : string, status : OrderStatus) : void {
  this.confirmPopupService.confirm({
    message: `dashboard.Update order status to ${status}?`,
    icon : 'info',
    accept : () => {
    this.orderStore.updateOrderStatus(orderId , userId , status);
    },
    reject : () => {}
  })
  }

}
