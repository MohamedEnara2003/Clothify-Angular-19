import { Component, computed, inject, linkedSignal } from '@angular/core';
import { ProductSizes } from "../../products/components/product-sizes";
import { ChooseQuantity } from "../../../shared/components/choose-quantity/choose-quantity";
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { CartStore } from '../../../../../store/cart/cart.signal';
import {  CartProductSize } from '../../../../../core/interfaces/carts.interface';
import { ProductSize } from '../../../../../core/interfaces/products.interface';
import { NgImageComponent } from "../../../../../shared/components/ng-image/ng-image.component";


@Component({
  selector: 'app-model-update-size-and-quantity',
  imports: [ProductSizes, ChooseQuantity, SharedModule, NgImageComponent],
  template: `
  <section class="w-full h-svh fixed flex justify-center items-center top-0 left-0 z-50" 
  role="dialog" aria-modal="true" aria-labelledby="edit-cart-product-title">

    <article class="animate-up relative w-full max-w-2xl h-[90%]  bg-white border border-neutral-content 
    flex flex-col gap-4 p-5 rounded z-50 text-neutral shadow-lg" role="article">

      <header aria-label="Edit cart product header" class="w-full flex justify-between items-center gap-4">
        <h1 id="edit-cart-product-title" class="text-xl font-bold">{{'cart.Update Size and Quantity' | translate}}</h1>
        <button aria-label="Close modal" routerLink="/main/cart" role="button" type="button" 
        class="material-icons btn  btn-circle btn-sm">
            close
        </button>
      </header>

      @let cartProduct = cartStore.userCartProduct();
      @if(cartProduct){
      <section class="flex flex-col gap-4">
      
        @let productImage = cartProduct.productId;
        @if(productImage){
        <app-ng-image
        [options]="{
        src : productImage.images[0].img_url ,
        alt : 'Product Image' ,
        placeholder : productImage.images[1].img_url ,
        width :  150 , 
        height : 150 ,
        class : 'shadow  rounded object-contain ' ,
        loading : 'lazy' ,
        decoding : 'async'
        }"
        />
        }
        
        <h2 class="text-lg font-semibold capitalize" aria-label="Product Name">{{cartProduct?.productId?.name}}</h2>
        
        @if(newSize()){
        <app-product-sizes aria-label="Choose product size"
        [sizes]="cartProduct.productId.sizes"  
        [selectedSize]="newSize()!" 
        (selectedSizeChange)="newSize.set($event!)"
        />
        }
      
        <app-choose-quantity aria-label="Choose quantity"
        [quantity]="newQuantity()" 
        [maxQuantity]="newSize() ? newSize()?.stock! :  cartProduct.productId.stock!"
        (quantityChange)="newQuantity.set($event)"
        />
      </section> 
      }
      <footer class="flex justify-end gap-4 mt-4">
        <button role="button" routerLink="/main/cart" type="button" class="btn btn-neutral" aria-label="Save changes"
        (click)="onSaveChanges()">
        {{'cart.Save Changes' | translate}}
        </button>
        <button role="button" routerLink="/main/cart" type="button" class="btn btn-outline" aria-label="Cancel">
          {{'common.Cancel' | translate}}
        </button>
      </footer>
    </article>
    <div routerLink="/main/cart" class="w-full h-full z-20 bg-black/60 fixed top-0 left-0" 
    aria-label="Close modal overlay">
  </div>
  </section>
  `,
})
export class ModelUpdateSizeAndQuantity {
  readonly cartStore = inject(CartStore);
  

  newSize = linkedSignal<ProductSize | null>(() =>  {
    const selectedSize = this.cartStore.userCartProduct()?.selectedSize;
    if(!selectedSize) return null;
    return {
      size : selectedSize.size,
      _id : selectedSize.size_id,
      stock : selectedSize.stock
    };
  });

  newQuantity = linkedSignal<number>(() => {
    const userCartProduct = this.cartStore.userCartProduct()
    if(!userCartProduct) return 1 ;
    const selectedQuantity = userCartProduct.quantity;
    if(!selectedQuantity) return 1;
    return selectedQuantity;
  });
  
  

onSaveChanges() : void {
  const userCartProduct = this.cartStore.userCartProduct();
  const cartId = this.cartStore.userCart()?._id;
  const productId = userCartProduct?.productId._id;
  if(!cartId || !productId || !userCartProduct) return;

  const newSize : CartProductSize | null = {
    size : this.newSize()?.size || '' ,
    size_id : this.newSize()?._id || '' ,
    stock : this.newSize()?.stock || 0
  };

  const newQuantity = this.newQuantity();

  // Add null check for selectedSize
  const prevSizeId = userCartProduct.selectedSize?.size_id;

  if(newSize && prevSizeId && newSize.size_id !== prevSizeId){
    this.cartStore.updateSize(cartId , newSize , productId);
  }

  if(newQuantity !== userCartProduct.quantity){
    this.cartStore.updateQuantity(cartId , productId , newSize , newQuantity);
  }
}


}
