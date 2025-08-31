import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/modules/shared.module';
import { OrderDetails } from "../components/order-details";
import { Information } from "../pages/information/ui/information";
import { SelectLangComponent } from "../../../shared/components/translation/select-lang.component";

@Component({
  selector: 'app-checkout',
  imports: [SharedModule, OrderDetails, Information, SelectLangComponent],
  template: `
  <section aria-label="Section Checkout" role="section" 
  class="w-full min-h-svh grid grid-cols-1  gap-5 p-4  md:px-10 ">

  <header aria-label="Header Checkout" role="header" class="w-full grid grid-cols-1 gap-4">
  <nav class="flex items-center gap-5">
  <a routerLink="/main/cart" href="/main/cart"  aria-label="Button Back" role="button" type="button" class="btn btn-ghost btn-circle ">
  <span class="material-icons" style="font-size: 2rem;">west</span>
  </a>
  <app-select-lang />
  </nav>
  <h1 class="text-2xl sm:text-3xl font-extrabold uppercase">{{'checkout.Checkout'  | translate}}</h1>
  </header>

  <main aria-label="Main Checkout" role="main" 
  class="w-full flex   flex-col-reverse  md:flex-row justify-center items-start gap-2 md:gap-15 lg:gap-20  ">
  
  <section aria-label="Section Checkout" role="section" class="w-full  grid grid-cols-1  lg:flex-2">
  <app-information />
  </section>

  <section aria-label="Section Order Details" role="section" class="w-full lg:flex-1">
  <app-order-details />
  </section>
  </main>

  </section>
  `,
})
export class Checkout {
}
