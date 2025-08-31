import { Component, signal } from '@angular/core';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { PriceSummary } from "../../../../../shared/components/price-summary/price-summary";

@Component({
  selector: 'app-order-summary-card',
  imports: [SharedModule, PriceSummary],
  template: `
  <article aria-label="Article Order Summary" role="article" 
  
  class="w-full h-90  border border-neutral-content grid grid-cols-1 gap-5 p-5 rounded">
    <header aria-label="Header Order Summary" role="header">
      <h2 aria-label="Title Order Summary" role="title" class="text-lg font-semibold text-neutral">{{'cart.Order Summary' | translate}}</h2>
    </header>

    <main aria-label="Main Order Summary" role="main" class="w-full grid grid-cols-1 gap-1">
    <app-price-summary />
    </main>

    <form  aria-label="Form Terms and Conditions Order Summary" role="form" class="flex items-center gap-2">
    <input type="checkbox" id="terms" class="checkbox checkbox-neutral rounded checkbox-sm"
    [checked]="isTermsChecked()"
    (change)="isTermsChecked.set(!isTermsChecked())"
    />
    <label for="terms" class="text-sm text-neutral font-semibold">{{'common.I agree to the Terms and Conditions' | translate}}</label>
    </form>

    <button [routerLink]="isTermsChecked() ? '/checkout' : '/main/cart'" type="button" class="w-full btn "
    [ngClass]="isTermsChecked() ? 'btn-neutral ' : 'btn-active  cursor-not-allowed'">
    {{'common.Continue' | translate}}
    </button>

   </article>
  `,
})
export class OrderSummaryCard {

  isTermsChecked = signal<boolean>(false);



}
