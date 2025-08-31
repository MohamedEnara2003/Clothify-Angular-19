import { Component, computed, inject, linkedSignal,  signal } from '@angular/core';
import { ProductsStore } from '../../../../../store/products/products.signals';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';
import { Product } from '../../../../../core/interfaces/products.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { LoadingSpinner } from "../../../../main/shared/components/loading/loading-spinner";
import { FilterAside } from "../../../../main/pages/products/pages/products/components/filter-aside";
import { CollectionsStore } from '../../../../../store/products/collections.signal';
import { CollectionsHeaderComponent } from "../components/collections-header.component";
import { CollectionsService } from '../service/collections.service';
import { NgImageComponent } from "../../../../../shared/components/ng-image/ng-image.component";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControlComponent } from "../../../../../shared/components/form-control/form-control.component";


@Component({
  selector: 'app-collections-form',
  imports: [
  SharedModule, 
  FilterAside, 
  LoadingSpinner, 
  CollectionsHeaderComponent, 
  NgImageComponent, 
  FormControlComponent
  ],
  template: `
  <section aria-label="Collections Form Page" role="region"
  class="w-full h-[90svh] bg-white grid grid-cols-1  items-start  overflow-y-auto" 
  style="scrollbar-width: none;">

    @if(isFilter()){ 
  <section aria-label="Section Filter" role="region"
  class="w-full h-svh flex fixed top-0 left-0 items-center  z-50">
    <app-filter-aside
    class="relative  w-[75%] sm:w-70 h-full  z-50  overflow-y-scroll   bg-white p-2 shadow-md 
    shadow-neutral" style="scrollbar-width: none;"
    [isFilter]="isFilter()" 
    (isFilterChange)="isFilter.set($event)" 
    />
    <div (click)="isFilter.set(false)" class="size-full bg-neutral/50 fixed top-0 left-0 z-30"></div>
  </section>
}

  <form [formGroup]="titleForm"  aria-label="Form Create Products Collections"  role="form"
  class="w-full h-full flex flex-col justify-between gap-1 px-2" (ngSubmit)="createCollections()">


  <legend  class="w-full flex flex-wrap justify-between items-center">
  <app-collections-header [isExistingCollection]="existingCollectionId() ? true : false"/>
  
  <button (click)="isFilter.set(!isFilter())" type="button" role="button" aria-label="Button Filter" 
    class="btn btn-neutral btn-sm"  >
    {{'buttons.Filter' | translate}}
    <span class="material-icons-outlined">filter_alt</span>
  </button>

  </legend>


  <fieldset class="fieldset grid grid-cols-1 sm:grid-cols-2 gap-4">
  <app-form-control
  [option]="{
  type : 'text' ,
  id : 'titleAr' ,
  name: 'titleAr',
  label: 'Title Arabic',
  formControlName : 'titleAr' ,
  isRequired : true ,
  }"
  [form]="titleForm"
  />

  <app-form-control
  [option]="{
  type : 'text' , 
  id : 'titleEn' ,
  name: 'titleAr',
  label: 'Title English',
  formControlName : 'titleEn' ,
  isRequired : true ,
  }"
  [form]="titleForm"
  />
  </fieldset>



  <button aria-label="Button Create Collections" type="submit" role="button" class="btn btn-neutral">
  {{'dashboard.' + (!existingCollectionId()  ? 'Create Collection' : 'Update Collection') | translate}}
  </button>
  

  <section aria-label="Section Products Collections" role="region" class="w-full h-90 pb-2">
  @defer (when !productsStore.loading()) {
  <ul cdkDropList
  aria-label="Product list. Use arrow keys to move items." role="list"
  [cdkDropListData]="productsCollections()"
  (cdkDropListDropped)="drop($event)"
  class="size-full overflow-y-auto 
  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5">
  @for (product of productsCollections(); let i = $index ; track product._id) {
  <li cdkDrag class="w-full bg-white h-40 relative shadow shadow-neutral/50 list-none z-40 rounded 
  hover:shadow-2xl duration-300 transition-shadow"
  [attr.aria-label]="'Product-' + i"
  aria-grabbed="true"
  role="listbox"
  tabindex="0"
  >
  @defer (on viewport) {
  <header role="heading" class="w-full absolute top-0 left-0 flex justify-between p-2">
  <span class="badge badge-sm badge-outline badge-neutral">{{i + 1}}</span>

  <button aria-label="Button Remove Product From Collections" role="button"
  type="button" class="material-icons btn btn-circle btn-sm text-error "
  (click)="removeProduct(product._id!)">
  delete
  </button> 
  </header>
  

  @let images =  product.images ;
        <app-ng-image
        [options]="{
        src : images[0].img_url ,
        placeholder : images[1].img_url ,
        alt : 'Product image' + (i + 1) ,
        width :  100 , 
        height : 100 ,
        class : 'size-full object-contain bg-white' ,
        loading : 'lazy' ,
        decoding : 'async'
        }"
        />

  <footer class="w-full absolute bottom-0 left-0 flex justify-center items-center "> 
  <button cdkDragHandle [title]="'Drag product ' +  (i + 1)"
  aria-label="Button drag handle"  aria-hidden="true" role="button"
  type="button" class="material-icons  text-neutral/50  cursor-grab hover:text-neutral/70 hover:scale-105
  duration-300  transition-all"style="font-size: 8rem;">
  drag_indicator
  </button> 
  </footer>
  }@placeholder {
  <app-loading-spinner />
  }
  </li>
  }
  </ul>
  }@placeholder {
  <app-loading-spinner />
  }
  </section>

  </form>
  </section>
  `,
})
export class CollectionsFormComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly collectionService = inject(CollectionsService);
  readonly collectionsStore = inject(CollectionsStore);
  readonly productsStore = inject(ProductsStore);

  public titleForm!: FormGroup;
  
  existingCollectionId = signal<string | null>(this.activatedRoute.snapshot.paramMap.get('id') || null)

  isFilter = signal<boolean>(false);
  
  productsCollections = linkedSignal<Product[]>(() => this.productsStore.products());

  filtersItems = computed<Array<{title : string , items : string[]}>>(() => {
  const filters = this.productsStore.productFilter()?.filterData;
  if(filters){
  return filters.filter(({title}) => title !== "color" && title !== 'category' && title !== 'fitType')
  .map((filter) => ({...filter,items: ['All', ...filter.items] }));
  }
  return []
  })
  

  constructor(private fb: FormBuilder){
    this.titleForm = this.fb.group({
    titleAr: ['', [Validators.required, Validators.minLength(3)]],
    titleEn: ['', [Validators.required, Validators.minLength(3)]],
    });

  this.getProducts();
  if(this.isFilter()){
  this.productsStore.getProductsFilters();
  }
  }

  removeProduct(id : string) : void {
  this.productsCollections.update((prev) => prev.filter(({_id}) => _id !== id));
  }

  drop(event: CdkDragDrop<Product[]>) {
  const currentProducts = this.productsCollections();
  moveItemInArray(currentProducts, event.previousIndex, event.currentIndex);
  this.productsCollections.set(currentProducts);
  }

  
  private getProducts() : void {
  const id = this.existingCollectionId();
  if(id){
  this.getCollectionById(id);
  return
  }
  this.productsStore.getQueryFilters(25 , 'images,gender,type,tags');
  }

  // View existing collection
  private getCollectionById(id : string) : void {
    this.collectionService.getCollectionById(id).pipe(
    tap(({data}) => {
    const {products , titleEn ,titleAr , queries} = 
    {...data , products : data.products.flatMap((p) => p.productId)};
    this.productsCollections.set(products);

    this.titleForm.patchValue({titleAr , titleEn});


    console.log(queries);
    
    this.router.navigate([], {queryParams : queries , queryParamsHandling : 'merge'})
    }),takeUntilDestroyed()
  ).subscribe();
  }


    createCollections() : void {
    const product = this.productsCollections().map(({_id}) => ({productId : _id || ''}) );
    const queries = this.productsStore.filter(); 
    const id = this.existingCollectionId()
    if(product.length > 0 && queries && this.titleForm.valid){
    const {titleAr , titleEn} = this.titleForm.getRawValue();
    id ?
    this.collectionsStore.updateCollection(id , {titleAr , titleEn ,queries} ,  product) :
    this.collectionsStore.createCollection({titleAr , titleEn ,queries} ,  product) ;
    return
    }
    this.titleForm.markAllAsTouched()
    }
}
