import { Component, input, model } from '@angular/core';
import { UserOrderData } from '../../../../../core/interfaces/order.interface';
import { SharedModule } from '../../../../../shared/modules/shared.module';

@Component({
  selector: 'app-order-info',
  imports: [SharedModule],
  template: `
      <article class="animate-sideLeft size-full  bg-white absolute left-0 top-0 flex items-center justify-center z-10">

      <section class="w-full bg-base-100 rounded-lg shadow-lg p-6 flex flex-col " 
      aria-labelledby="shipping-info-title" role="region">
      
        <header class="w-full flex justify-between items-center" role="banner">
        <h2 id="shipping-info-title" class="text-2xl font-bold">{{ 'orderInfo.Shipping Information' | translate }}</h2>
        <button type="button" class="material-icons btn btn-circle "
          (click)="isLoad.set(false)"> west
        </button>
        </header>

        <address class="not-italic" itemscope itemtype="https://schema.org/PostalAddress" 
        aria-label="User shipping address">
          <ul class="grid grid-cols-1 gap-3" role="list">
            <li role="listitem">
              <span class="font-semibold text-neutral">{{ 'orderInfo.Full Name' | translate }} </span>
              <span class="text-base-content" itemprop="name">{{userData().firstName}} {{userData().lastName}}</span>
            </li>
            <li role="listitem">
              <span class="font-semibold text-neutral">{{ 'orderInfo.Email' | translate }} </span>
              <a class="text-base-content underline" [href]="'mailto:' + userData().email" itemprop="email">{{userData().email}}</a>
            </li>
            <li role="listitem">
              <span class="font-semibold text-neutral">{{ 'orderInfo.Phone' | translate }} </span>
              <a class="text-base-content underline" [href]="'tel:' + userData().phone" itemprop="telephone">{{userData().phone}}</a>
            </li>
            <li role="listitem">
              <span class="font-semibold text-neutral">{{ 'orderInfo.Address' | translate }} </span>
              <span class="text-base-content" itemprop="streetAddress">{{userData().address}}</span>
            </li>
            <li role="listitem">
              <span class="font-semibold text-neutral">{{ 'orderInfo.Country' | translate }} </span>
              <span class="text-base-content" itemprop="addressCountry">{{userData().country}}</span>
            </li>
            <li role="listitem">
              <span class="font-semibold text-neutral">{{ 'orderInfo.City' | translate }} </span>
              <span class="text-base-content" itemprop="addressLocality">{{userData().city}}</span>
            </li>
            <li role="listitem">
              <span class="font-semibold text-neutral">{{ 'orderInfo.State/Region' | translate }} </span>
              <span class="text-base-content" itemprop="addressRegion">{{userData().stateRegion}}</span>
            </li>
            <li role="listitem">
              <span class="font-semibold text-neutral">{{ 'orderInfo.Postal Code' | translate }} </span>
              <span class="text-base-content" itemprop="postalCode">{{userData().postalCode}}</span>
            </li>
          </ul>
        </address>
      </section>
    </article>
  `,
})
export class OrderInfoComponent {
  isLoad = model.required<boolean>()
  userData = input.required<UserOrderData>()
}
