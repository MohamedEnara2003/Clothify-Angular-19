import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { ProductCard } from "./product-card";
import { Product, QueryFilter } from '../../../../../core/interfaces/products.interface';



@Component({
selector: 'app-products-slider',
imports: [SharedModule, ProductCard],
template: `
@defer (on viewport) {
    <section aria-label="Section Products Slider" role="section" 
    class="w-full grid grid-cols-1 gap-4 animate-up">
    <ng-content />
    <header class="w-full grid grid-cols-3 sm:grid-cols-5 justify-items-center-safe  
    items-center text-neutral gap-1">
    @if(title()){ 
    <div class="w-full sm:col-span-2 h-0.25 bg-neutral relative flex justify-start items-center 
    after:bg-neutral after:size-3  sm:after:size-4 after:absolute after:rounded-full">
    </div>

    <h1 aria-label="Title Collection" 
    class="w-full  sm:col-span-1 text-base xs:text-lg sm:text-xl  md:text-2xl lg:text-3xl 2xl:text-5xl 
    font-extrabold  line-clamp-3  text-center">
    {{title() | translate}}
    </h1>

    <div class=" w-full  sm:col-span-2 h-0.25 bg-neutral relative flex justify-end items-center 
    after:bg-neutral after:size-3  sm:after:size-4 after:absolute after:rounded-full">
    </div>
    }
    </header>

<swiper-container #swiperRef
aria-label="Container Products Slider" role="container" 
[speed]="500"
[effect]="'slide'"
[grabCursor]="true"
[keyboard]="true"
[breakpoints]="breakpoints()"
[navigation]="true"
[observer]="true"
[observeParents]="true"
class="w-full " >
@for (product of products(); track product._id) {
<swiper-slide>
<app-product-card 
[product]="product" 
[isActive]="productID() === product._id"
[isHide]="isHide()"
/>
</swiper-slide>
}
</swiper-container>

@if(queries() && !isHide()){
    <footer class="w-full flex justify-center items-center bg-neutral p-1">
    <a href="/main/collections" routerLink="/main/collections"  
    [queryParams]="queries()" 
    queryParamsHandling="merge"
    aria-label="Link View All" role="link"
    class="link  border-neutral-content text-neutral-content hover:text-secondary transition-colors duration-300">
    {{'common.View All' | translate}} {{'products.Products'  | translate}}
    </a>
    </footer>
}
</section>
}@placeholder {
    <div class="w-full h-120 bg-neutral-300 animate-pulse"></div>
}
`,
    schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductsSlider {
    products = input.required<Product[]>();
    productID = input<string>('');

    queries = input<QueryFilter>();
    queryParams = input<{[key : string] : string}>();
    title = input<string>('');

    isHide = input(false);

breakpoints = input<{[width : string] : {spaceBetween: number, slidesPerView: number}}>({
'0': { spaceBetween: 10, slidesPerView: 1 },
'380': { spaceBetween: 10, slidesPerView: 2 },
'540': { spaceBetween: 10, slidesPerView: 3 },
'1024': { spaceBetween: 10, slidesPerView: 4 },
'1536': { spaceBetween: 20, slidesPerView: 5 }
})
}
