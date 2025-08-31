import { Component, inject, input, model } from '@angular/core';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { ProductSize } from '../../../../../core/interfaces/products.interface';
import { AlertService } from '../../../../../core/services/alert.service';

@Component({
  selector: 'app-product-sizes',
  imports: [SharedModule],
  template: `
  <section aria-label="Section Filter Sizes" role="section" class="w-full grid grid-cols-1 gap-1">

  <nav aria-label="Navigation Product Sizes" role="navigation" class="flex flex-col gap-1">
    
    <h2 class="font-semibold text-neutral">{{'cart.Size' | translate}}: {{selectedSize()?.size}}</h2>

    <ul aria-label="List Product Sizes" role="list" class="flex items-center gap-2">
    @for(item of sizes(); track item.size){
    <li aria-label="Item Product Size" role="item" class="flex justify-between items-center">

    <button [title]="item.stock === 0 ? 'Size is not available' : 'Add Size'"
    (click)="addSizeToCart(item)" type="button" [attr.aria-label]="'Button Size' + item.size" role="button"  
    class="btn  size-8 rounded-none font-extrabold"
    [ngClass]="selectedSize()?.size === item.size ? 'btn-outline' : 
    item.stock === 0 ? 'btn-neutral  bg-error text-white cursor-not-allowed opacity-50' : 'btn-neutral'">
    {{item.size}}
    </button>
    </li> 
    }
    </ul>
  </nav>
    <ng-content />
  </section>
  `,
})
export class ProductSizes  {
  private readonly alert = inject(AlertService);
  sizes = input<ProductSize[]>();
  
  selectedSize = model<ProductSize>();
  quantity = model<number>();
  
  addSizeToCart(size : ProductSize) : void {
  if(size.stock === 0){

  this.alert.alertOption.set([
  {id : 1 , isLoad : true  , isLoadTime : 2000 , alertMessage : 'This size is out of stock' 
  , alertType : 'alert-error'
  }
  ])

  }
  this.selectedSize.set(size);
  this.quantity.set(1);
  }
}
