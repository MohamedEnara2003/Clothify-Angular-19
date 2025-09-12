import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { SharedModule } from '../../../../../../../shared/modules/shared.module';
import { ProductSizes } from "../../../components/product-sizes";
import { ChooseQuantity } from "../../../../../shared/components/choose-quantity/choose-quantity";
import { Product, ProductSize } from '../../../../../../../core/interfaces/products.interface';
import { WishlistStore } from '../../../../../../../store/wishlist/wishlist.signal';
import { BtnAddToCartComponent } from "../../../components/btn-add-to-cart.component";
import { BtnAddToWishlistComponent } from "../../../components/btn-add-to-wishlist.component";



@Component({
  selector: 'app-product-info',
  imports: [
  SharedModule,
  ProductSizes,
  ChooseQuantity, 
  BtnAddToCartComponent, 
  BtnAddToWishlistComponent, 
  ]
  ,
  template: `
  <section aria-label="Section Product Info" role="section" 
  class="w-full  flex justify-center items-start border border-neutral-content rounded  p-4 ">

  @if (product()) {
  <article class="text-neutral relative w-full  h-full flex flex-col gap-4">
  @let stock = selectSize() ? selectSize().stock : product().stock || 0;
  
  <header class="flex items-center gap-2 text-neutral">
  <app-btn-add-to-wishlist [product]="product()" />

  <span class="badge font-extrabold"
  [ngClass]="{
  'badge-error' : stock === 0,
  'badge-warning' :stock < 10  && stock > 0,
  'badge-success' :stock >= 10,
  }">
  {{( stock <= 0 ? 'Out of Stock' : stock < 10 ? 'Low Stock : ' + stock : 'In Stock' )}}
  </span>
  </header>
  
  <h1 class="text-lg font-bold capitalize line-clamp-3">{{product().name}}</h1>
  
  <p class="font-medium text-sm uppercase">
  {{'type.' + product().type | translate }} - 
  {{ 'fitType.' + product().fitType  | translate}}
  </p>


  <div class="flex items-center gap-2">
  @if(product().discound > 0){
  <span itemprop="price" class="line-through text-neutral font-bold">
    {{product().price| currency : 'EGP' : 'symbol' : '1.0-0'}}
  </span>
  /
  }
  <span itemprop="price" class="text-xl text-secondary font-extrabold">
    {{product().final_price| currency : 'EGP'}}
  </span>
  </div>
  
  <div class="flex items-center gap-1 capitalize">
    <h2 class="font-semibold">{{ 'product.color' | translate }}</h2>
    <span class="text-neutral ">
      {{product().color}}
    </span>
  </div>

  @if(selectSize()) { 
  <app-product-sizes [sizes]="product().sizes" 
  [selectedSize]="selectSize()"
  (selectedSizeChange)="selectSize.set($event!)"
  [quantity]="selectQuantity()" (quantityChange)="selectQuantity.set($event!)">
  <p class="text-sm text-neutral font-light">{{'messages.findSize' | translate}}</p>
  </app-product-sizes>
  }

  <div class="flex flex-col   gap-1">
    <h2 class="font-semibold">{{ 'product.quantity' | translate }}</h2>
    <app-choose-quantity  [isColumn]="false" [quantity]="selectQuantity()" 
    (quantityChange)="selectQuantity.set($event!)"
    [maxQuantity]="maxQuantity()"/>
  </div>
  
  @let productId = product()._id ;
  <app-btn-add-to-cart  
  [productId]="productId!"
  [selectSize]="selectSize()"
  [selectQuantity]="selectQuantity()"
  [isDisabled]="stock === 0 || !productId"
  />
  </article>
  }

</section>
  `,
})
export class ProductInfo {
  readonly wishlistStore = inject(WishlistStore);
  product = input.required<Product>();

  selectQuantity = signal<number>(1);

  selectSize = linkedSignal<ProductSize >(() => {
  const size = this.product().sizes.filter((size) => size.stock > 0)[0];
  return size ;
  });
  
  maxQuantity = computed<number>(() => {
  const size = this.selectSize()
  const stock = size ? size.stock : this.product().stock || 50 ;
  return stock
  })


}
