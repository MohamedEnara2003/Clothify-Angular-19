import { Component, inject, signal } from '@angular/core';
import { PaymentMethod, PaymentType } from '../../../interface/checkout.interface';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { UploadReceiptComponent } from "../components/upload-receipt.component";
import { OrderStore } from '../../../../../store/orders/orders.signal';

@Component({
  selector: 'app-payment',
  imports: [SharedModule, UploadReceiptComponent],
  template: `

    <fieldset class="fieldset space-y-2" role="radiogroup" aria-labelledby="payment-method-legend">
    <legend id="payment-method-legend" class="legend md:text-base text-sm font-semibold  uppercase">
      {{ 'checkout.Payment Method' | translate }}
    </legend>

    @for (item of paymentList(); track item.id) {
    @let selectedPaymentMethod =  orderStore.selectedPaymentMethod();
    <section class="flex flex-wrap justify-between items-center gap-2 
    border   px-2 rounded-t-xl text-base" role="presentation"
    [ngClass]="(orderStore.receiptErrorMsg() && selectedPaymentMethod === item.paymentMethod 
    && selectedPaymentMethod !== 'Delivery')
    ? 'border-error'  : 'border-neutral/20'">
      
    <div class="flex items-center gap-2">
      <input type="radio" [id]="item.label" name="payment-method" 
      class="radio radio-neutral radio-sm"  
      [checked]="selectedPaymentMethod === item.paymentMethod"
      [routerLink]="['/checkout']" [queryParams]="{paymentMethod:  item.paymentMethod}"
      role="radio"
      [attr.aria-checked]="selectedPaymentMethod === item.paymentMethod"
      [attr.aria-labelledby]="item.label + '-label'"
      />
      <label [for]="item.label" [id]="item.label + '-label'" class="cursor-pointer ">
      {{ ('checkout.' + item.label) | translate }}
      </label>
    </div>

  <div class="size-12 flex justify-center items-center cursor-pointer"
    [routerLink]="['/checkout']" [queryParams]="{paymentMethod: item.paymentMethod}"
    role="img" [attr.aria-label]="item.label + ' logo'">
    @if (item.icon) {
    <span class="material-icons-outlined text-neutral" aria-hidden="true">{{item.icon}}</span>
    }@else if (item.image) {
    <img [src]="item.image" [alt]="item.label + ' logo'" class="size-full object-contain">
    }
  </div>

  @if (item.paymentMethod === selectedPaymentMethod && selectedPaymentMethod !== 'Delivery') {
  <app-upload-receipt class="w-full" 
  [adminNumber]="selectedPaymentMethod === 'Vodafone-Cash' ? '01111111111' : '01010101010'" 
  [paymentMethod]="orderStore.selectedPaymentMethod()!"
  />

  }

  </section>
  }
  <ng-content select="[receiptErrorMsg]" />
  </fieldset>
  `,
})
export class Payment {
  private readonly activtedRoute = inject(ActivatedRoute);
  readonly orderStore = inject(OrderStore);

  paymentList = signal<PaymentType[]>([
  {
    id: 1,
    label : 'Delivery',
    icon: 'local_shipping',
    paymentMethod: 'Delivery',
  },
  {
    id: 2,
    label : 'Vodafone-Cash',
    image: 'vodafone-cash.webp',
    paymentMethod: 'Vodafone-Cash',
  },
  {
    id: 3,
    label : 'Instapay',
    image: 'instapay.webp',
    paymentMethod: 'Instapay',
  },
  ]).asReadonly();

  constructor() {
    this.getQueryPaymentMethod();
  }

  private getQueryPaymentMethod = () => {
  this.activtedRoute.queryParamMap.pipe(
  tap((params) => {
    const paymentMethod = params.get('paymentMethod') as PaymentMethod;
    if (!paymentMethod)return ;
    this.orderStore.getPaymentMethod(paymentMethod)
  }),
  takeUntilDestroyed()
  ).subscribe()
  }

}
