import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { Product, ProductSize } from '../../../../../core/interfaces/products.interface';
import { WishlistStore } from '../../../../../store/wishlist/wishlist.signal';
import { BtnAddToCartComponent } from "./btn-add-to-cart.component";
import { BtnAddToWishlistComponent } from "./btn-add-to-wishlist.component";
import { UploadImage } from '../../../../../core/interfaces/files.interface';
import { LoadingSpinner } from "../../../shared/components/loading/loading-spinner";
import { ImageOption, NgImageComponent } from "../../../../../shared/components/ng-image/ng-image.component";

@Component({
  selector: 'app-product-card',
  imports: [
    SharedModule,
    BtnAddToCartComponent, 
    BtnAddToWishlistComponent, 
    LoadingSpinner, 
    NgImageComponent
  ],
  template: `
<article
  aria-label="Product Card"
  role="article"
  class="w-full h-100 sm:h-120 2xl:h-130 flex flex-col justify-center items-center gap-2 border 
  border-neutral-content transition-all duration-300"
  [ngClass]="isActive() ? 'shadow-lg shadow-neutral-500' : ''"
>
  @defer (on viewport) {
    @let title = product().gender + ' ' + product().type;

    <section
      [title]="title"
      aria-label="Container Product Image"
      role="container"
      class="w-full h-[80%] cursor-pointer relative group overflow-hidden"
    >
      <!-- Header -->
      <header
        aria-label="Header Product Card"
        role="header"
        class="absolute top-2 left-0 w-full flex justify-between items-center z-20 p-2"
      >
        <span
          aria-label="Discount"
          class="text-xs text-neutral/50"
          [ngClass]="product().discound ? 'bg-secondary text-secondary-content rounded-full px-1' : 'hidden'"
        >
          {{ product().discound / 100 | percent : '1.0-0' }}
        </span>
        <app-btn-add-to-wishlist [product]="product()" />
      </header>

      <!-- Product Image -->
      @let images = product().images;
      <app-ng-image 
      [routerLink]="['/main/products', product()._id]"
      aria-label="Picture Product Card"
      class="size-full"
      [options]="imageOption()!"
      (optionsChange)="imageOption.set($event)"
      (mouseenter)="imageView.set(images[1] || images[0])"
      (mouseleave)="imageView.set(images[0])"
      />

      <!-- Add to Cart Button -->
      @let productId = product()._id;
      @if((selectSize() || product().stock) && productId && !isHide()) {
        <app-btn-add-to-cart
          [productId]="productId"
          [selectSize]="selectSize()"
          [selectQuantity]="1"
          class="md:group-hover:flex md:hidden animate-up duration-300 transition-all  
          absolute bottom-0 left-0 w-full"
        />
      }
    </section>

    <!-- Product Details -->
    <section
      aria-label="Product Details"
      role="container"
      class="w-full grid grid-cols-1 h-[20%] text-neutral bg-neutral-content p-2"
    >
      <h2 class="line-clamp-1 capitalize font-semibold">{{ product().name }}</h2>
      <p class="line-clamp-1 text-sm capitalize">{{ 'type.' + product().type | translate }}</p>

      <div class="w-full flex justify-end items-center gap-4 text-sm sm:text-lg">
        @if(product().discound > 0) {
          <span class="line-through decoration-2">
            {{ product().price | currency : 'EGP' : 'symbol' : '1.0-0' }}
          </span>
        }
        <span class="font-bold text-secondary">
          {{ product().final_price | currency : 'EGP' : 'symbol' : '1.0-0' }}
        </span>
      </div>
    </section>
  }
  @placeholder {
    <app-loading-spinner />
  }
</article>

  `,
})
export class ProductCard {
  readonly wishlistStore = inject(WishlistStore);
  product = input.required<Product>();


  isHide = input(false);
  isActive = input<boolean>(false);

  selectSize = computed<ProductSize | undefined>(() => {
  const sizes =  this.product().sizes
  if(sizes) return  sizes.filter((size) => size.stock > 0)[0];
  return undefined
  });


  imageView = linkedSignal<UploadImage>(() => {
  const images = this.product().images;
  return  images.length > 0 ?  images[0] : {img_url : '' , img_id : ''};
  }) 
  
  imageOption = linkedSignal<ImageOption>(() => {
  const images = this.product().images;
  return {
  src : this.imageView().img_url ,
  alt : 'Product Image' ,
  placeholder : images[1].img_url  ,
  width : 300 ,
  height : 300 , 
  class : 'w-full h-full object-contain z-40 group-hover:scale-105 transition-all duration-300 '
  + images[1] && this.imageView().img_id === images[1].img_id ? 'animate-opacity' : '',
  loading : 'lazy',
  decoding : 'async'
  }
  })



}
