import { Component, computed, Inject, inject, model, OnDestroy, signal } from '@angular/core';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { LanguageService } from '../../../../../../core/services/translations/language.service';
import { SearchInputComponent } from "../../../../../../shared/components/search-input/search-input.component";
import { ProductsStore } from '../../../../../../store/products/products.signals';
import { Product, QueryFilter } from '../../../../../../core/interfaces/products.interface';
import { ProductsSlider } from "../../../../pages/products/components/products-slider";
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-search-bar-aside',
  imports: [SharedModule, SearchInputComponent, ProductsSlider],
  template: `
  <section aria-label="Main Aside" role="section" 
  class="w-full h-svh fixed top-0 left-0 z-[100] flex justify-start items-start">

  <aside aria-label="Main Aside" role="aside" 
  class="w-[90%] sm:w-[80&] lg:w-1/2 h-full  bg-white shadow-xs shadow-neutral relative z-[100] p-5 text-neutral 
  flex flex-col  items-start gap-5 overflow-y-auto overflow-hidden"
  [ngClass]="languageService.currentLanguage() === 'en' ? 'animate-sideLeft' : 'animate-sideRight'">


  <form class="w-full grid grid-cols-1 items-start gap-4">
  <legend class="w-full flex justify-between items-center">
  <h1 class="text-lg font-bold">{{'Search' }}</h1>
  <button type="button" class="material-icons btn btn-circle btn-sm"   (click)="isOpenSearchBarAside.set(false)" >
  close
  </button>
  </legend> 
  <fieldset>
  <app-search-input  
  [isFocus]="isOpenSearchBarAside()"
  [value]="searchValue()" 
  (valueChange)="searchValue.set($event)"/>
  </fieldset>
  </form>
  
  
  @if(productsFilter().length > 0){
  <section class="w-full grid grid-cols-1 gap-4">
  <app-products-slider 
  [products]="productsFilter()" 
  [breakpoints]="{
  '0': { spaceBetween: 0, slidesPerView: 1 },
  '380': { spaceBetween: 0, slidesPerView: 2 },
  }"
  title="Popular Products"
  />
  </section>
  }@else {
  <section class="w-full grid grid-cols-1 gap-4">
  <header>
  <h1 class="text-lg sm:text-xl 2xl:text-2xl font-extrabold"> Product Results</h1>
  </header>
  <a aria-label="Search Link" role="link" [href]="'/search/' + searchValue()" routerLink="/main/collections" 
  class="text-lg md:text-xl font-semibold line-clamp-2   link-secondary">
  <span class="text-neutral font-bold">Search For</span> "{{searchValue()}}"
  <span class="material-icons">east</span>
  </a>
  </section>
  }
  </aside>

  <div aria-label="Main Aside Background" role="container"  class="size-full bg-neutral/70 fixed top-0 left-0 z-50"
  (click)="isOpenSearchBarAside.set(false)">
  </div>
</section>
  `,
})
export class SearchBarAsideComponent implements OnDestroy{
  readonly  languageService = inject(LanguageService);
  isOpenSearchBarAside = model<boolean>(false);
  private readonly productStore = inject(ProductsStore);

  searchValue = signal<string>('');

  productsFilter = computed<Product[]>(() => {
    const query = this.searchValue().trim().toLowerCase();
  
    if (!query) return this.productStore.products();
  
    return this.productStore.products().filter(product => {

      const match = (value?: string | number): boolean => {
        if (value === undefined || value === null) return false;
        return value.toString().toLowerCase().includes(query);
      };
  
      return (
        match(product.name) ||
        match(product.gender) ||
        match(product.category) ||
        match(product.type) ||
        match(product.fitType) ||
        match(product.color) ||
        match(product.final_price)
      );
    });
  });
  

  constructor(@Inject(DOCUMENT) private doc: Document){
  doc.body.style.overflow = 'hidden'

  const filters : QueryFilter = {tags : ['Popular' , 'New' , 'Best Seller' , 'Sale' ,'Limited' ,'Featured']};
  this.productStore.getProducts(1 , 200 , filters);
  }

  ngOnDestroy(): void {
  this.doc.body.style.overflow = 'auto'
  }

}
