import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, input, signal, viewChild } from '@angular/core';
import { SharedModule } from '../../../../../../../shared/modules/shared.module';
import { SwiperContainer } from 'swiper/element';
import { UploadImage } from '../../../../../../../core/interfaces/files.interface';
import { LoadingSpinner } from "../../../../../shared/components/loading/loading-spinner";
import { NgImageComponent } from "../../../../../../../shared/components/ng-image/ng-image.component";

@Component({
  selector: 'app-product-images',
  imports: [SharedModule, LoadingSpinner, NgImageComponent],
  template: `
  <section aria-label="Section Product Images" role="region"  
  class="w-full flex flex-col  justify-center gap-5 ">

  <swiper-container #swiperRef
  aria-label="Swiper Product Images"
  [slidesPerView]="1"
  [spaceBetween]="10"
  [speed]="500"
  [observer]="true"
  [observeParents]="true"
  (swiperactiveindexchange)="sliderChange()"
  class="w-full rounded-lg shadow-lg border border-neutral-content " >
  @for (item of images(); let i = $index; track item.img_id) {

  <swiper-slide>
  @defer (on viewport) {
  <div class="relative w-full aspect-square flex items-center justify-center rounded ">
    <app-ng-image 
    [options]="{
    src : item.img_url ,
    alt : 'Product Image ' + (i + 1) ,
    placeholder : '',
    width : 500 ,
    height : 500 ,
    class : 'object-contain  transition-transform duration-700 hover:scale-105' ,
    loading : i === 0 ? null : 'lazy' ,
    decoding : 'async',
    fetchpriority :  i === 0 ? 'high' : 'auto'
    }"
    />
  <span class="absolute right-1 text-sm bottom-0 bg-neutral-content text-neutral rounded-full px-2 py-1">
  ({{i + 1}} / {{images()?.length}})
  </span>
  </div>
}@placeholder {
  <div class="w-full aspect-square  rounded  border-2 border-neutral-content">
  <app-loading-spinner/>
  </div>
  }
  </swiper-slide>
} 
</swiper-container>

  <swiper-container #swiperRef
  aria-label="Swiper Product Thumbnails"
  [slidesPerView]="4"
  [spaceBetween]="10"
  [navigation]="true"
  [speed]="500"
  [loop]="true"
  [observer]="true"
  [observeParents]="true"
  (swiperactiveindexchange)="sliderChange()"
  class="w-full">
  @for (item of images() ; let i = $index; track item.img_id) {

  <swiper-slide >
  @defer (on viewport) {  
    <app-ng-image 
    tabindex="0"
    [options]="{
    src : item.img_url ,
    alt : 'Thumbnail Image ' + (i + 1) ,
    placeholder : '',
    width : 80 ,
    height : 80 ,
    class : 'object-contain size-full rounded-md' ,
    loading : i === 0 ? null : 'lazy' ,
    decoding : 'async',
    }"

  class="size-20 sm:size-25 rounded cursor-pointer  border-2 hover:border-secondary hover:opacity-100
  flex items-center justify-center bg-white shadow-sm duration-300 transition-all"
  [ngClass]="isImageActive() === i ? ' border-secondary' : 'opacity-50 border-neutral-content'"
  (click)="swiperRef.swiper.slideTo(i)"
  (keydown.enter)="swiperRef.swiper.slideTo(i)"
/>

  }@placeholder {
  <div class="size-20 sm:size-25 rounded  border-2 border-neutral-content">
  <app-loading-spinner styleClass="size-12"/>
  </div>
  }
  </swiper-slide>
  }
  </swiper-container>
  </section>
  `,
schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductImages {
  swiperRef = viewChild<ElementRef<SwiperContainer>>('swiperRef');
  images = input<UploadImage[]>();

  isImageActive = signal<number>(0);

  sliderChange() {
  const swiperRef = this.swiperRef()?.nativeElement
  if(swiperRef) {
  this.isImageActive.set(swiperRef.swiper.activeIndex);
  }
  }
  
}
