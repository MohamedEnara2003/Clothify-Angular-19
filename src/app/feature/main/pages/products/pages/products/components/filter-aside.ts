import { Component, computed, inject, model } from '@angular/core';
import { FilterType } from "./filter-type/filter-type";
import { FliterPriceRange } from "./fliter-price-range/fliter-price-range";
import { SharedModule } from '../../../../../../../shared/modules/shared.module';
import { ProductsStore } from '../../../../../../../store/products/products.signals';


@Component({
  selector: 'app-filter-aside',
  imports: [FilterType, FliterPriceRange , SharedModule],
  template: `

  <aside aria-label="Aside Filter" role="aside" class="w-full  grid grid-cols-1 gap-5 ">
    <header class="text-neutral w-full flex justify-between items-center ">
    <h1 class="text-xl font-bold flex items-center">
    <span class="material-icons-outlined">filter_alt</span>
    {{'buttons.Filter' | translate}}
    </h1>
    @if(isFilter()){
    <button (click)="isFilter.set(!isFilter())" type="button" role="button" aria-label="Button Filter" 
    class="btn btn-ghost btn-circle btn-sm text-neutral ">
    <span class="material-icons">close</span>
    </button>
    }
    </header>

    <main aria-label="Main Filter Content" role="main" class="size-full grid grid-cols-1  gap-2">
    @for (filter of filterData(); track filter) {
    @if(filter.items.length > 0){
    <app-filter-type [isOpen]="true" [title]="filter.title" [items]="filter.items"/>
    }
    } 
    <app-fliter-price-range [minPrice]="prices().minPrice" [maxPrice]="prices().maxPrice" />
    </main>
</aside>


`,
})
export class FilterAside {
  readonly productStore = inject(ProductsStore);

  filterData = computed(() => {
    const filter = this.productStore.productFilter();
    return Array.isArray(filter?.filterData) && filter.filterData.length > 0
      ? filter.filterData
      : [];
  });
  
  prices = computed(() => {
    const prices = this.productStore.productFilter()?.prices;
    if(!prices || prices.length === 0) return {minPrice : 100 , maxPrice : 100000};
    return prices[0]
  });

  isFilter = model<boolean>(false);
  
  constructor(){
  this.productStore.getProductsFilters();
  }

}
