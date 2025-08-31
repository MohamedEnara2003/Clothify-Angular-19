import { Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { ConfirmPopupService } from '../../../../../core/services/confirm-popup.service';
import { ProductsStore } from '../../../../../store/products/products.signals';
import { PaginationComponent } from "../../../../../shared/components/pagination/pagination.component";
import { NavCheckLinksComponent } from "../../../shared/components/nav-check-links/nav-check-links.component";
import { TableEmptyComponent } from "../../../shared/components/table-empty/table-empty.component";
import { LoadingSpinner } from "../../../../main/shared/components/loading/loading-spinner";
import { CheckDataService } from '../../../../../core/services/check-data.service';
import { CheckAllComponent } from "../../../shared/components/check-all/check-all.component";
import { NgImageComponent } from "../../../../../shared/components/ng-image/ng-image.component";
import { SelectSort } from "../../../../main/pages/products/pages/products/components/select-sort/select-sort";


@Component({
  selector: 'app-products',
  imports: [
  SharedModule,
  PaginationComponent, 
  NavCheckLinksComponent, 
  TableEmptyComponent, 
  LoadingSpinner, 
  CheckAllComponent, 
  NgImageComponent, 
  SelectSort
  ],
  template: `
  <section class="w-full h-[90svh] flex flex-col justify-between items-start  gap-2"
  aria-label="Product Management Page">


    <h1 aria-label="Title Product Management Page" 
    class="w-full text-center text-lg xs:text-2xl sm:text-3xl font-bold text-neutral"> 
    {{'dashboard.Product Management' | translate}}
    </h1>
    

  <section class="w-full  flex flex-col gap-1">

  <header class="w-full flex justify-between items-center z-10">
  <button  type="button" role="button" aria-label="Button Create Product"
  routerLink="/dashboard/products/upsert-product"
  class="btn btn-md btn-secondary uppercase">
  <span class="material-icons">add</span>
  {{'dashboard.Create Product' | translate}}
  </button>

  <div class="flex items-center gap-2">
  <app-nav-check-links (confirm)="confirm()" />
  <app-select-sort />
  </div>
  </header>

<div class="w-full overflow-auto max-h-[450px] 2xl:max-h-[650px] border border-base-300 rounded-md">
  <table class="table table-xs xs:table-sm md:table-md 2xl:table-lg w-full">
    @defer (when productsStore.products().length > 0 ) {
    <thead class="bg-neutral-content sticky top-0 z-10">
      <tr>
        <th class="flex items-center gap-5">
          <app-check-all />
          <span>{{'View' | translate}}</span>
        </th>
        @for (item of tableColumns(); track item) {
          <th>{{ 'dashboard.' + item  | translate}}</th>
        }
      </tr>
    </thead>

    <tbody>
      @for (product of productsStore.products() ; let i = $index; track product._id) {

        @defer (on viewport) {
        <tr>

          <th class="flex items-center gap-5">
        
            <input type="checkbox" class="checkbox checkbox-neutral"
              (change)="checkDataService.onCheckData(product._id || '')"
              [checked]="checkDataService.valueIds().includes(product._id || '')" 
              />

            <button
              [title]="('View Product' | translate) + ' ' + (i + 1)"
              type="button"
              role="button"
              class="material-icons text-secondary btn btn-sm btn-circle"
              [attr.aria-label]="('View Product' | translate) + ' ' + (i + 1)" 
              [routerLink]="['/dashboard/products/upsert-product' , product._id]" 
              >
              visibility
            </button>
          </th>

        <td>

        @let productImage = (product.images && product.images.length > 0) ? product.images[0] : null;

        @if(productImage){ 
        <div class="border border-neutral/20 rounded  size-15  p-1">
        <app-ng-image
        [options]="{
        src : productImage.img_url,
        
        alt : ('Product Image' | translate) ,
        width :  50 , 
        height : 50 ,
        class : 'size-full object-contain' ,
        loading : 'lazy' ,
        decoding : 'async'
        }"
        />
        </div>
        } 
        </td>
        
          <td>
          {{product._id}}
          </td>

          <td>{{'category.' + product.category | translate}}</td>
          <td>{{'type.' + product.type | translate}}</td>
          <td>{{'gender.' + product.gender | translate}}</td>
          <td class="font-extrabold text-secondary">{{product.final_price | currency : 'EGP'}}</td>
        </tr>
      }@placeholder {
        <tr class="text-center ">
        <th  [attr.colspan]="tableColumns().length + 1">
        <div class="w-full h-15 bg-neutral-300 animate-pulse"></div>
        </th>
        </tr>
        }
      }@empty {
        <tr>
          <th [attr.colspan]="tableColumns().length + 1" class="text-center py-10">
            <app-table-empty 
            message="messageProductsEmpty"
            paragraph="paragraphProductsEmpty"
            />
          </th>
        </tr>
      }
    </tbody>

    @if(productsStore.products().length > 0){ 
    <tfoot class="sticky bottom-0 z-10 bg-base-100">
        <tr>
          <td colspan="100%" class="">
            <app-pagination
              [currentPage]="productsStore.currentPage()"
              [totalPages]="productsStore.totalPages()"
              class="flex justify-center" />
          </td>
        </tr>
      </tfoot>
    }
  }@placeholder {
  <section class="w-full h-[350px] bg-white flex justify-center items-center">
  <app-loading-spinner />
  </section>
  }
  </table>
</div>
</section>


</section>
  `,
})
export class Products implements OnDestroy{
  private readonly confirmPopupService = inject(ConfirmPopupService);
  readonly checkDataService = inject(CheckDataService);

  readonly productsStore = inject(ProductsStore);
  
  tableColumns = signal<string[]>(['Product' ,'ID' ,'Category' , 'Type' ,'Gender', 'Price']).asReadonly();
  


  private productsIds = computed(() => 
  this.productsStore.products().map(p => p._id || '')
  );

  constructor(){
  effect(() =>  this.checkDataService.initAllDataIds(this.productsIds())); 
  this.productsStore.getQueryFilters(15);
  }


  confirm() : void {
  const productIds = this.checkDataService.valueIds();
    this.confirmPopupService.confirm({
    message : this.checkDataService.isCheckAllData() ? 'delAllProductsMsg' : 'delProductsMsg' ,
    icon : 'help' ,
    accept : () => {
    this.productsStore.deleteProducts(productIds);
    this.checkDataService.clearAllChecks()
    },
    reject : () => {
    this.checkDataService.clearAllChecks()
    }
    })
  }

  ngOnDestroy(): void {
  this.checkDataService.clearAllChecks();
  }

}