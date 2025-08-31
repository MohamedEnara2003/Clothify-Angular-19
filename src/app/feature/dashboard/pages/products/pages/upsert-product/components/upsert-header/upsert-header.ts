import { Component, input } from '@angular/core';
import { SharedModule } from '../../../../../../../../shared/modules/shared.module';

@Component({
  selector: 'app-upsert-header',
  imports: [SharedModule],
  template: `
 <header class="flex  items-center gap-2" role="heading" aria-label="Upser Form Header">
        <a title="Back To Product Management"
        routerLink="/dashboard/products" href="/dashboard/products" role="link"  class="btn btn-circle btn-ghost"
        aria-label="Back to products Management Page">
        <span class="material-icons text-secondary hover:text-secondary/90 duration-200 transition-colors"
        style="font-size: 2rem;">
        keyboard_backspace
        </span>
        </a>

      <h1 id="product-form-title" class="text-xl sm:text-2xl font-bold">
        {{isExistingProduct() ? ('forms.Update' | translate) : ('forms.Create' | translate)}} <span class="text-secondary">{{'forms.Product Form' | translate}}</span>
      </h1>
    </header>
  `,
})
export class UpsertHeader {
  isExistingProduct = input<boolean>(false);
}
