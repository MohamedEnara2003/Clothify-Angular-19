import { Component, input, model } from '@angular/core';
import { Receipt } from '../../../../../core/interfaces/order.interface';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { NgImageComponent } from "../../../../../shared/components/ng-image/ng-image.component";

@Component({
  selector: 'app-order-receipt',
  imports: [SharedModule, NgImageComponent],
  template: `
  <article class="animate-down size-full  bg-white absolute left-0 top-0 
  flex flex-col items-center justify-center gap-2 z-10 p-6">
    
  <header class="w-full flex justify-between items-center" role="banner">
  <h2 id="receipt-info-title" class="text-2xl font-bold">{{'orderReceipt.ReceiptImage' | translate}}</h2>
  <button type="button" class="material-icons btn btn-circle "
  (click)="isLoad.set(false)">close
  </button>
  </header>
  
    <app-ng-image
    [options]="{
    src : receipt().receipt_img ,
    alt : 'Receipt Image' ,
    width : 500 ,
    height : 500 ,
    class : 'size-full object-contain' ,
    loading : 'lazy' ,
    decoding : 'async'
    }"
    class="w-full h-full flex flex-col justify-center items-center"
    />
  </article>
  `,
})
export class OrderReceiptComponent {
  isLoad = model.required<boolean>();
  receipt = input.required<Receipt>();
}
