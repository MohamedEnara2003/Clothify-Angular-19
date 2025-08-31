import { Component, inject, signal } from '@angular/core';
import { FilterAside } from "../components/filter-aside";
import { ProductsHeader } from "../components/products-header/products-header";
import { ProductCard } from "../../../components/product-card";
import { SharedModule } from '../../../../../../../shared/modules/shared.module';
import { ProductsStore } from '../../../../../../../store/products/products.signals';
import { PaginationComponent } from "../../../../../../../shared/components/pagination/pagination.component";
import { LoadingSpinner } from "../../../../../shared/components/loading/loading-spinner";

@Component({
  selector: 'app-products',
  imports: [FilterAside, ProductsHeader, ProductCard, SharedModule, PaginationComponent, LoadingSpinner],
  template: `
    <section aria-label="Section Products" role="section" class="grid grid-cols-1 gap-5">
    
      <app-products-header [isFilter]="isFilter()" (isFilterChange)="isFilter.set($event)"/>

      <main aria-label="Main Products" role="main" 
      class="w-full flex flex-col md:flex-row justify-between items-start  mt-5 gap-5 overflow-hidden">

      <app-filter-aside 
      class="w-70 2xl:w-100  fixed top-0 left-0  z-50 h-svh md:h-auto  
      overflow-y-scroll md:overflow-y-visible bg-white 
      md:relative duration-500 transition-all ease-in-out"
      [ngClass]="isFilter() ? 
      'h-full  z-50 shadow-md shadow-neutral translate-x-0 p-4 py-6 ' 
      : '-translate-x-[200%] md:translate-x-0 md:block'" style="scrollbar-width: none;"
      [isFilter]="isFilter()" 
      (isFilterChange)="isFilter.set($event)" 
      />


      <section    class="w-full grid grid-cols-1 gap-10 md:w-3/4 ">
      @if(!productsStore.loading()){
      <ul class="w-full grid gap-2 lg:gap-5 "
      [ngClass]="(productsStore.products() || []).length === 0 ? 'grid-cols-1' :
      'grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 '">

      @for (product of productsStore.products(); track product) {
      <li>
      <app-product-card [product]="product"/>
      </li>
      }@empty {
      <div class="w-full h-80  flex flex-col justify-center items-center gap-4 ">
      <h1 class="text-3xl md:text-4xl font-bold text-secondary">{{'dashboard.No Products Found' | translate}}</h1>
      <a routerLink="/main/collections" href="/main/collections" role="link" aria-label="Link Clear Filters" 
      class="btn md:btn-lg btn-neutral" >{{'filters.Clear All' | translate}}
      </a>
      </div>
      }
      </ul>
      <app-pagination
      [currentPage]="productsStore.currentPage()"
      [totalPages]="productsStore.totalPages()"
      />
      }@else {
      <app-loading-spinner class="h-80"/>
      }
      
  
      </section>
      </main>

    </section>
  `,
})
export class Products {
  productsStore = inject(ProductsStore);
  isFilter = signal<boolean>(false);

  constructor(){
  this.productsStore.getQueryFilters(12);
  }
  



}
