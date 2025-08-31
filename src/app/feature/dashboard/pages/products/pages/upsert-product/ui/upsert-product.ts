import { Component, OnInit, signal, OnDestroy, effect, linkedSignal, inject, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product, ProductCategory, SizesType } from '../../../../../../../core/interfaces/products.interface';
import { SharedModule } from '../../../../../../../shared/modules/shared.module';
import { UploadProductImages } from "../components/upload-product-images/upload-product-images";
import { UploadFiles } from '../../../../../../../core/services/upload-files.service';
import { tap, Subject, combineLatest, EMPTY } from 'rxjs';
import { ProductsService } from '../../../service/products';
import { ActivatedRoute } from '@angular/router';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';
import { TagsForm } from "../components/tags-form/tags-form";
import { SizeForm } from "../components/size-form/size-form";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UploadImage } from '../../../../../../../core/interfaces/files.interface';
import { UpsertHeader } from "../components/upsert-header/upsert-header";
import { FormControlComponent, FormControlOption } from "../../../../../../../shared/components/form-control/form-control.component";
import { ProductsStore } from '../../../../../../../store/products/products.signals';



@Component({
  selector: 'app-upsert-product',
  imports: [
    SharedModule,
    UploadProductImages,
    TagsForm,
    SizeForm,
    UpsertHeader,
    FormControlComponent,
],
  template: `
    <section class="w-full h-[90svh]  bg-white" aria-label="Product Form Section">


      <form [formGroup]="productForm" (ngSubmit)="onSubmit()" 
      class="w-full h-full  grid grid-cols-1 gap-2   pb-3   rounded shadow" 
      role="form" aria-labelledby="product-form-title">

      <legend>
      <app-upsert-header [isExistingProduct]="existingProduct() !== null" />
      </legend>
    
      <fieldset class="fieldset w-full h-full overflow-y-auto   grid grid-cols-1 sm:grid-cols-2 gap-5 
      py-5">

      @for (ctrl of controls(); track ctrl.formControlName) {
      <app-form-control
      [option]="ctrl"
      [form]="productForm"
      [ngClass]="ctrl.inputClass" />
      }


        <app-size-form [form]="productForm" 
        [existingSizes]="existingProduct()?.sizes!" 
        [isSubmitted]="isSubmited()" 
        [sizesValues]="availableSizes()" class="col-span-2"/>
      
        <app-tags-form [form]="productForm" [existingTags]="existingProduct()?.tags!"  class="col-span-2"/>
      
        <app-upload-product-images  
        [isSubmitted]="isSubmited()"  
        [productImages]="productImages()"
        (productImagesChange)="productImages.set($event)"
        class="col-span-2"/>
        </fieldset>

        <button 
        type="submit" 
        class="btn btn-neutral btn-square w-full" 
        aria-label="Submit Product Form"
        role="button"
        >
      {{existingProduct() !== null ? ('buttons.Update Product' | translate) : 
      ('buttons.Create Product' | translate)}}
      </button>
      </form>

    </section>
  `,
  providers : [UploadFiles]
  
})
export class UpsertProduct implements OnInit, OnDestroy {
  availableCategories = signal<ProductCategory[]>([]);
  availableTypes = signal<string[]>([]);
  availableFitTypes = signal<string[]>([]);
  availableSizes = signal<SizesType[]>([]);

  controls = computed<FormControlOption[]>(() => [
    {
      type: 'text',
      formControlName: 'name',
      label: 'labels.Product Name',
      id: 'product-name',
      isRequired: true,
      inputClass: 'col-span-1 md:col-span-2'
      
    },
    {
      type: 'number',
      formControlName: 'price',
      label: 'labels.Price',
      id: 'product-price',
      isRequired: true,
      inputClass: 'col-span-2 md:col-span-1'
    },
    {
      type: 'number',
      formControlName: 'discound',
      label: 'labels.Discount',
      id: 'product-discound',
      inputClass: 'col-span-2 md:col-span-1'
    },
    {
      type: 'text',
      formControlName: 'color',
      label: 'labels.Color',
      id: 'product-color',
      isRequired: true,
      inputClass: 'col-span-2 md:col-span-1'
    },
    {
      type: 'select',
      formControlName: 'category',
      label: 'labels.Select Category',
      id: 'product-category',
      isRequired: true,
      textForTranslate: 'category.',
      selectOptions: this.availableCategories(),
      inputClass: 'col-span-2 md:col-span-1'
    },
    {
      type: 'select',
      formControlName: 'type',
      label: 'labels.Select Type',
      id: 'product-type',
      isRequired: true,
      textForTranslate: 'type.',
      selectOptions: this.availableTypes(),
      inputClass: 'col-span-2 md:col-span-1'
    },
    {
      type: 'select',
      formControlName: 'fitType',
      label: 'labels.Select fitType',
      id: 'product-fitType',
      isRequired: true,
      textForTranslate: 'fitType.',
      selectOptions: this.availableFitTypes(),
      inputClass: 'col-span-2 md:col-span-1'
    },
    {
      type: 'select',
      formControlName: 'gender',
      label: 'labels.Select Gender',
      id: 'product-gender',
      isRequired: true,
      textForTranslate: 'gender.',
      selectOptions: ['NONE', 'MEN', 'WOMEN', 'KIDS'],
      inputClass: 'col-span-2 md:col-span-1'
    },
    {
      type: 'textarea',
      formControlName: 'description',
      label: 'labels.Description',
      id: 'product-description',
      inputClass: 'col-span-2'
    }
  ]);

  private destroy$ = new Subject<void>();
  private productsStore = inject(ProductsStore);


  existingProduct = signal<Product | null>(null);
  productImages = linkedSignal<UploadImage[]>(() => this.existingProduct()?.images || []);
  productForm!: FormGroup;



  isLoading = signal<boolean>(false);
  isSubmited = signal<boolean>(false);
  
  constructor(
  private fb: FormBuilder,
  private productsService : ProductsService ,
  private activatedRoute : ActivatedRoute,
  ){
  this.getExistingProduct();
  effect(() => {
  this.initEditedProductInFrom();
  })
  }

  ngOnInit() {
  this.createProductForm();
  this.onChangeCategoryToTypeAndSize();
  this.initCategoryToTypes();
  }

  // Init Edited Product In Form
  private initEditedProductInFrom() : void {
  const  existingProductData = this.existingProduct();
  if(existingProductData){
  this.productForm.patchValue({...existingProductData});
  }
  }

  // Create Product Form
  private createProductForm() {
  this.productForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      price: ['', [Validators.required, Validators.min(50) , Validators.max(2000000)]],
      discound: [0, [Validators.min(0) , Validators.max(100)]],
      color: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      category: ['APPAREL', Validators.required],
      type: ['T-SHIRT', Validators.required],
      fitType	: ['', Validators.required],
      gender: ['', Validators.required],
      description: [''],
      stock: [0, [Validators.min(0) , Validators.max(100000)]],
      sizes: this.fb.array([]),
      tags: this.fb.array([]),
  });
  }

  // Update category for Type and fitType
  private updateCategoryData(selectedCategory: ProductCategory, selectedType: string) {
    const collections = this.productsService.collections();

    const types = collections[selectedCategory].flatMap(item => Object.keys(item) as string[]);

    const sizes = this.productsService.CategoryToSizes()[selectedCategory] || [];

    // Ensure selected type is valid
    let typeToUse = selectedType;
    if (!types.includes(typeToUse)) {
      typeToUse = types[0] ?? '';
      this.productForm.controls['type'].setValue(typeToUse, { emitEvent: false });
    }

    const fitTypeEntry = collections[selectedCategory]
      .find(item => Object.keys(item)[0] === typeToUse);

    const fitTypes = fitTypeEntry && typeToUse in fitTypeEntry
      ? fitTypeEntry[typeToUse as keyof typeof fitTypeEntry]
      : [];

    // Set available data
    this.availableCategories.set(Object.keys(collections) as ProductCategory[]);
    this.availableTypes.set(types);
    this.availableFitTypes.set(fitTypes);
    this.availableSizes.set(sizes);
  }

  /**  استدعاء عند بداية التحميل */
  private initCategoryToTypes(): void {
    const category = this.productForm.controls['category'].value as ProductCategory;
    const type = this.productForm.controls['type'].value as string;
    this.updateCategoryData(category, type);
  }

  /**  استماع للتغييرات */
  private onChangeCategoryToTypeAndSize(): void {
    const categoryControl = this.productForm.controls['category'];
    const typeControl = this.productForm.controls['type'];

    combineLatest([
      categoryControl.valueChanges.pipe(startWith(categoryControl.value)),
      typeControl.valueChanges.pipe(startWith(typeControl.value)),
    ])
      .pipe(
        tap(([category, type]) => {

        const c = category as ProductCategory ;
        const t   = type as string ;
        this.updateCategoryData(c , t);

        if(c === 'ACCESSORIES'){
        this.productForm.removeControl('sizes')
        }else{
        this.productForm.addControl('sizes' ,  this.fb.array([]))
        }
              
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }


    private getExistingProduct() : void {
    this.activatedRoute.paramMap.pipe(
    switchMap((param) =>  {
    const productId = param.get('id');
    if(productId){
    return this.productsService.getProductById(productId).pipe(
    tap(({data}) => this.existingProduct.set(data))
    );
    }
    return EMPTY
    }) ,takeUntilDestroyed()
    ).subscribe();
  }
  

    onSubmit() {
    if(this.productForm.valid){
    const existingProduct  = this.existingProduct() 
    const formValues = this.productForm.getRawValue();
    const product : Product = {...formValues, images: this.productImages()};
    
    return existingProduct ?  
    this.productsStore.updateProduct({_id : existingProduct?._id , ...product}) : 
    this.productsStore.createProduct(product);
    }
    this.isSubmited.set(true);
    this.productForm.markAllAsTouched();
    }

  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
