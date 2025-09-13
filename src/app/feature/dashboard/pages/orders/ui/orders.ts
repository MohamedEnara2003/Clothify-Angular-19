import { Component, computed, effect, inject , OnDestroy, signal } from '@angular/core';
import { OrderStore } from '../../../../../store/orders/orders.signal';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { Order } from '../../../../../core/interfaces/order.interface';
import { ConfirmPopupService } from '../../../../../core/services/confirm-popup.service';
import { OrderViewComponent } from "../components/order-view.component";
import { NavCheckLinksComponent } from "../../../shared/components/nav-check-links/nav-check-links.component";
import { TableEmptyComponent } from "../../../shared/components/table-empty/table-empty.component";
import { CheckDataService } from '../../../../../core/services/check-data.service';
import { CheckAllComponent } from "../../../shared/components/check-all/check-all.component";

@Component({
  selector: 'app-orders',
  imports: [
    SharedModule,
    OrderViewComponent,
    NavCheckLinksComponent, 
    TableEmptyComponent, 
    CheckAllComponent
  ],
  template: `
<section class="w-full h-[90svh] overflow-y-auto flex flex-col justify-center items-start py-2 gap-4"
aria-label="Order Management Page" role="region">

  <h1 aria-label="Title Order Management Page" 
    class="w-full text-center text-lg xs:text-2xl sm:text-3xl font-bold text-neutral"> 
    {{'dashboard.Order Management' | translate}}
  </h1>

<section class="w-full h-full flex flex-col  items-start  gap-2">

<header class="w-full flex flex-wrap justify-between items-center gap-2 p-1 bg-base-100 z-10">
  <app-nav-check-links  (confirm)="confirmDeleteOrder()" />
</header>


<div class="w-full overflow-auto max-h-[600px] border border-base-300 rounded-md">
  <table class="table table-xs xs:table-sm md:table-md w-full">

    <!-- Table Header -->
    <thead class="bg-neutral-content sticky top-0 z-10">
      <tr>
        <th class="flex items-center gap-5">
        <app-check-all />
        <span>{{ 'dashboard.View' | translate }}</span>
        </th>
        @for (item of tableColumns(); track item) {
          <th>{{ item | translate }}</th>
        }
      </tr>
    </thead>

    <!-- Table Body: Users with Orders -->
    @for (user of orderStore.orders(); track user._id) {
      @let userOrdersCount = user.orders.length;
      @if (userOrdersCount > 0) {
        <tbody class="border-b border-b-neutral-300">
          <!-- User Header Row -->
          <tr>
            <th [attr.colspan]="tableColumns().length + 1" class="font-bold text-neutral">
              <div class="flex justify-between items-center w-full">
                <p>
                  {{ 'dashboard.User Id' | translate }}:
                  <span class="font-normal text-secondary">{{ user._id }}</span>
                </p>
                <span>
                  {{ 'dashboard.Total Orders' | translate }}: {{ userOrdersCount }}
                </span>
              </div>
            </th>
          </tr>

          <!-- Orders Rows -->
          @for (order of user.orders; let i = $index; track order._id) {
            <tr>
              <th class="flex items-center gap-5">
                <label>
                  <input type="checkbox" class="checkbox checkbox-neutral"
                    (change)="checkDataService.onCheckData(order._id!)"
                    [checked]="checkDataService.valueIds().includes(order._id!)" />
                </label>
                <button
                  [title]="('dashboard.View Order' | translate) + ' ' + (i + 1)"
                  type="button" role="button"
                  class="material-icons text-secondary btn btn-sm btn-circle"
                  [attr.aria-label]="('dashboard.View Order' | translate) + ' ' + (i + 1)"
                  (click)="orderStore.openOrderView({ userId: user.userId, order })">
                  visibility
                </button>
              </th>

              <td>{{ order._id }}</td>
              <td>{{ order.userData.firstName }}</td>
              <td>{{ order.totalPrice | currency : 'EGP' }}</td>
              <td>{{ order.paymentMethod }}</td>
              <td>
                <span class="badge font-extrabold shadow shadow-neutral"
                  [ngClass]="{
                    'badge-info': order.orderStatus === 'Pending',
                    'badge-success': order.orderStatus === 'Accepted',
                    'badge-warning': order.orderStatus === 'Shipped',
                    'badge-secondary': order.orderStatus === 'Delivered',
                    'badge-error': order.orderStatus === 'Cancelled'
                  }">
                  {{ 'dashboard.' + order.orderStatus | translate }}
                </span>
              </td>
              <td>{{ order.createdAt | date : 'dd/MM/yyyy' }}</td>
            </tr>
          }
        </tbody>
      }
    }

    @if(!isOrdersEmpty()){
      <tbody>
        <tr>
          <th [attr.colspan]="tableColumns().length + 1" class="text-center py-10">
            <app-table-empty 
            icon="shopping_basket"
            message="messageOrdersEmpty"
            paragraph="paragraphOrdersEmpty"
            />
          </th>
        </tr>
      </tbody>
    }
  </table>
</div>


</section>
@if(orderStore.orderView()){
  <app-order-view  [orderView]="orderStore.orderView()" (orderViewChange)="orderStore.openOrderView($event!)" />
}
</section>
`,
})
export class Orders implements OnDestroy{
  private readonly confirmPopupService = inject(ConfirmPopupService);
  readonly orderStore = inject(OrderStore);
  readonly checkDataService = inject(CheckDataService);


  // Elements Table Head
  readonly tableColumns = signal<string[]>([
  'Order ID', 'Customer', 'Total Price', 'Payment', 'Status', 'Date',]
  ).asReadonly();

  isOrdersEmpty = computed(() => this.orderStore.orders().some(({orders}) => orders.length > 0))

  ordersIds = computed<string[]>(() => this.orderStore.orders()
  .flatMap(({orders}) => orders.map(({_id}) => _id || ''))
  );

  constructor() {
  effect(() => this.checkDataService.initAllDataIds(this.ordersIds()))
  this.orderStore.getAllUserOrders();
  }
  

  confirmDeleteOrder() : void {
  const ordersIds = this.checkDataService.valueIds();
  this.confirmPopupService.confirm({
    message: this.checkDataService.isCheckAllData() ? "delAllOrdersMsg" : 'delOrdersMsg' ,
    icon : 'warning',
    accept : () => {
    this.orderStore.deleteUserOrder(ordersIds);
    this.checkDataService.clearAllChecks();
    },
    reject : () => this.checkDataService.clearAllChecks(),
    
  })
  }
  
  totalOrders(orders : Order[]) : number {
  return orders.reduce((prev , {totalPrice}) => prev += totalPrice , 0)
  }

  ngOnDestroy(): void {
  this.checkDataService.clearAllChecks();
  }
}