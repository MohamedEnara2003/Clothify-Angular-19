import { Component, computed, inject, signal } from '@angular/core';
import { ProductImages } from "../components/product-images";
import { ProductInfo } from "../components/product-info";
import { ProductsSlider } from "../../../components/products-slider";
import { ActivatedRoute } from '@angular/router';
import { catchError,  map,  of,  } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductsStore } from '../../../../../../../store/products/products.signals';
import { NavListItemsComponent } from "../../../../../shared/components/navigations/nav-list-items/nav-list-items.component";
import { Links } from '../../../../../shared/interfaces/links.interface';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingSpinner } from "../../../../../shared/components/loading/loading-spinner";


@Component({
  selector: 'app-product-details',
  imports: [ProductImages, ProductInfo, ProductsSlider, NavListItemsComponent, TranslateModule, LoadingSpinner],
  template: `
  <section aria-label="Section Product Details" role="section" 
  class="w-full grid grid-cols-1 gap-5">
  
  @defer (when productsStore.product()) {
  <header class="w-full">
  <app-nav-list-items [items]="navLinks()" [isHomeLink]="false" />
  </header>

  <main aria-label="Main Product Details" role="main" 
  class="w-full grid grid-cols-1 md:grid-cols-2  gap-5 lg:gap-10 xl:gap-20  ">
  <app-product-images [images]="productsStore.product()?.images"/>
  <app-product-info [product]="productsStore.product()!"/>
  </main>

  @let relatedProducts = productsStore.products() ;
  @if(relatedProducts.length > 0){ 
  <app-products-slider [title]="'RelatedProducts' | translate" 
  [products]="relatedProducts"
  [productID]="productID()"/>
  }
  }@placeholder {
  <div class="w-full h-[85svh] flex justify-center items-center">
  <app-loading-spinner />
  </div>
  }
  </section>
  `,
})
export class ProductDetails {
  private readonly activatedRoute = inject(ActivatedRoute);
  readonly productsStore = inject(ProductsStore);

  
  navLinks = computed<Links[]>(() => {
  const product = this.productsStore.product();
  if(!product) return [] ;
  return [
    {name: 'navigation.Collections', path: '/main/collections', icon: 'store'},
    {name: 'gender.' + product.gender, path: '/main/collections', icon: 'info',
    queryParams: {gender : product.gender}
    },
    {name: 'category.' + product.category, path: '/main/collections', icon: 'info',
    queryParams: {category : product.category}
    },
    {name: 'type.' + product.type, path: '/main/collections', icon: 'info',
    queryParams: {type: product.type}
    },
    {name: 'fitType.' + product.fitType, path: '/main/collections', icon: 'info',
    queryParams: {fitType: product.fitType}
    },
  ].filter((link => link.name))
  });

  productID = signal<string>('');

  constructor(){
  this.initProductDetails_RelatedProducts();
  }

  private initProductDetails_RelatedProducts() : void {
    this.activatedRoute.paramMap.pipe(
    map((params) => {
      const productId = params.get('id');
      if(productId){
      this.productID.set(productId);
      this.productsStore.getProductById(productId , true);
      return  
      }
    return of(null);
    }),
    catchError(() => of(null)),
    takeUntilDestroyed()
    ).subscribe();
  }


}
