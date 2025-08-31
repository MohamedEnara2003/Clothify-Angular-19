import { Component, inject, input } from '@angular/core';
import { ProductSize } from '../../../../../core/interfaces/products.interface';
import { CartStore } from '../../../../../store/cart/cart.signal';
import { CartProductSize } from '../../../../../core/interfaces/carts.interface';
import { SharedModule } from '../../../../../shared/modules/shared.module';

@Component({
  selector: 'app-btn-add-to-cart',
  imports: [SharedModule],
  template: `
  <button title="Add to cart" (click)="addToCart()" aria-label="Button Add To Cart" role="button"
  type="button" class="btn btn-neutral w-full uppercase font-semibold animate-up"
  [disabled]="isDisabled()">
  <span class="material-icons">add_shopping_cart</span>
  {{'products.Add to Cart' | translate}}
  </button>
  `,
})
export class BtnAddToCartComponent {
  private readonly cartStore = inject(CartStore);
  isDisabled = input<boolean>(false);
  productId = input.required<string>();
  selectSize = input<ProductSize>();
  selectQuantity = input<number>();


  addToCart(): void {
    const selectedSizeValue = this.selectSize();
    const productId = this.productId();
    const quantity = this.selectQuantity() || 1 ;
    if(this.isDisabled()) return; 
    
    if (!selectedSizeValue) return this.cartStore.addToCart(productId, quantity);

    const { _id: size_id, size, stock }: ProductSize = selectedSizeValue;
    if (!size_id || stock < quantity) return;
    const selectedSize: CartProductSize = { size, size_id, stock };
    this.cartStore.addToCart(productId, quantity , selectedSize);
  }

}

