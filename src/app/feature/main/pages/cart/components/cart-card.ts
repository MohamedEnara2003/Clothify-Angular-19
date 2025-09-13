import { Component, inject, model } from '@angular/core';
import { ProductCard } from "../../products/components/product-card";
import { CartWithProduct } from '../../../../../core/interfaces/carts.interface';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { CartStore } from '../../../../../store/cart/cart.signal';


@Component({
  selector: 'app-cart-card',
  imports: [ProductCard, SharedModule],
  template: `
  <section aria-label="Cart Card" role="region" class="w-full border border-neutral-content rounded p-4">
  @let userCart  = cart() ; 
  <ul aria-label="List of Products in Cart" role="list"
  class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4  items-start gap-4
  overflow-y-auto"

  [ngClass]="userCart && userCart.products.length > 1 ? 'h-180' : ''"
  style="scrollbar-width: none;">

  @for (product of userCart?.products; track product.productId) {
  <li aria-label="Product in Cart" role="listitem" class="w-full grid grid-cols-1 list-none">
  
  @defer (on viewport) {
  <header aria-label="Header Product in Cart" role="header" 
  class="w-full flex justify-between items-center gap-2 p-1 bg-neutral-content">

  @let selectedSize = product.selectedSize ;
  <button [title]="'Remove ' + product.productId.name" aria-label="Button Remove Product in cart" 
  role="button" type="button" class="material-icons text-secondary  btn btn-circle btn-sm"
  (click)="deleteProductFromCart(
  cart()?._id || '' , 
  product.productId._id || '' , 
  selectedSize ? selectedSize.size_id : null
  )">
  delete
  </button>

  <nav aria-label="Navigation Product in Cart" role="navigation" class="flex items-center gap-4">
  <p aria-label="Product Color and Size and Quantity" role="contentinfo" 
  class="flex gap-1 items-center text-neutral/60 font-semibold">
  <span class="capitalize">{{product.productId.color}}</span>/
  @if(product.selectedSize){
  <span>{{product.selectedSize.size}}</span>/
  }
  <span>{{product.quantity}}</span>
  </p>

<button  [routerLink]="['/main/cart/']"  
[queryParams]="{id: product.productId._id , size_id: selectedSize?.size_id || null}"
aria-label="Sync Product in Cart" role="button" type="button" 
class="material-icons btn btn-circle btn-sm text-secondary">
edit 
</button>
</nav>
</header>
<app-product-card [isHide]="true" [product]="product.productId" class="w-full"/>
 }@placeholder {
  <div class="w-full h-120 bg-neutral-300 animate-pulse"></div>
 }
</li>
}
</ul>

</section>
  `,
})
export class CartCard {
  private readonly cartStore = inject(CartStore);
  public cart = model<CartWithProduct>();

  deleteProductFromCart(cartId : string , productId : string , size_id : string | null) : void {
  if(!cartId || !productId ) return;
  this.cartStore.deleteProductFromCart(cartId , productId , size_id);
  }

}
