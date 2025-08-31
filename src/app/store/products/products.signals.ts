import { patchState, signalStore, withComputed, withMethods, withState , } from "@ngrx/signals";
import { Gender, Product, ProductCategory, ProductFilter, QueryFilter, Sort, Tags } from "../../core/interfaces/products.interface";
import { ProductsService } from "../../feature/dashboard/pages/products/service/products";
import { computed, inject } from "@angular/core";
import { catchError, of, tap } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CartProduct } from "../../core/interfaces/carts.interface";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";


interface ProductsState {
    products: Product[];
    product: Product | null;
    relatedProducts: Product[];

    // Filters Aside in Collections Page 
    productFilter : ProductFilter | null ,
    
    // Pagination
    currentPage : number ,
    totalPages: number ,
    totalProducts : number ,
    
    // Filters
    limit  : number ,
    filter : QueryFilter,

    loading: boolean;
    error: string | null;
}

const initialState : ProductsState= {
    products: [],

    product: null,
    relatedProducts: [],
    

    productFilter : null,

    currentPage : 0 ,
    totalPages: 0 ,
    totalProducts : 0 ,

    limit : 0 ,
    filter : {} as QueryFilter ,

    loading: false,
    error: null,
}

export const ProductsStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    
    withComputed((store) => {

    const filterItems = (items : string[]) : string[]  => [...new Set(items)];
    
    return {
    categories : computed<string[]>(() => filterItems(store.products().map(({category}) => category))),
    genders : computed<string[]>(() => filterItems(store.products().map(({gender}) => gender))),
    types : computed<string[]>(() => filterItems(store.products().map(({type}) => type))),
    fitTypes : computed<string[]>(() => filterItems(store.products().map(({fitType}) => fitType))),
    }
    }),

    withMethods((store) => {
    const productService = inject(ProductsService);
    const router = inject(Router);
    const activatedRoute = inject(ActivatedRoute);

    return {
    getProducts: (page?: number, limit?: number , filter? : QueryFilter , selected? : string) => {
    const isExistingFilter = JSON.stringify(filter) === JSON.stringify(store.filter());

    if(isExistingFilter && store.currentPage() === page) return ;

        patchState(store, {loading: true});
        productService.getProducts(page , limit , filter , selected).pipe(
            tap(({data}) => {  
            
            const {products , currentPage , totalPages  ,total : totalProducts} = data ;
        
            patchState(store, {
            products,
            currentPage ,
            totalPages ,
            totalProducts,
            loading: false,
            filter,
        });
            }),
            catchError((error) => {
                patchState(store, {error: error.message, loading: false});
                return of([]);
            }),
        ).subscribe();
    },

    getProductsFilters: () => {
        if(store.productFilter()) return;
        patchState(store, {loading: true});
        productService.getProductsFilters().pipe(
            tap(({data}) => patchState(store, {productFilter : data, loading: false})),
            catchError((error) => {
            patchState(store, {error: error.message, loading: false});
            return of(null);
            }),
            takeUntilDestroyed()
        ).subscribe();
    },

    getProductById (id: string , isLoadRelatedProducts : boolean = false)  : void{
    const product = store.product();
    if(product && product._id === id){ 
    return  this.getRelatedProducts(product , isLoadRelatedProducts) 
    }
    productService.getProductById(id).pipe(
            tap(({data}) => {
            if(data){
            const product = data;
            patchState(store, {product});
            this.getRelatedProducts(product , isLoadRelatedProducts)
            }
            }),
            catchError((error) => {
            router.navigateByUrl('/error/not-found');
            patchState(store, {error: error.message});
            return of(null);
            }),
    ).subscribe();
    },
    
    
    getRelatedProducts (product : Product , isLoadRelatedProducts  : boolean) : void{
    if(!isLoadRelatedProducts) return ;
        const {gender , type } = product; 
        const filters : QueryFilter = {gender ,type };
        this.getProducts(1 , 12 , filters);
    },

    createProduct(product : Product) : void {
    productService.createProduct(product).pipe(
    tap(({data}) => {
    if(!data) return;
    const products = [data , ...store.products()];
    patchState(store , {products});
    router.navigateByUrl('/dashboard/products');
    })).subscribe();
    },

    updateProduct(product : Product) : void {
    const productId = product._id || '';
    if(!productId) return;
    productService.updateProduct(product , productId).pipe(
    tap(({data}) => {
    if(!data) return;
    const products = store.products().map((product) => product._id === data._id ? data : product);
    patchState(store , {products});
    router.navigateByUrl('/dashboard/products');
    })).subscribe();
    },

    deleteProducts: (ids: string[]) => {
        productService.deleteProducts(ids).pipe(
            tap(() => {
            patchState(store, {
            products: store.products().filter((product) => !ids.includes(product._id || ''))
            });
            }),
        ).subscribe();
    },

    updateSizeStock(cartProduct : CartProduct) : void {
        const productId = cartProduct.productId._id;

        const selectedSize = cartProduct.selectedSize;
        if(!productId && !selectedSize) return ;
        const existingProduct = store.products().find((product) => product._id === productId );
        if(!existingProduct) return ;
        
        const sizesToUpdate = existingProduct.sizes.map((size) => {
        const sizeId = size._id ;
        if(!sizeId) return size ;
        return {...size , stock : sizeId.toString() === selectedSize?.size_id.toString() 
        ? Math.max(size.stock - cartProduct.quantity, 0) : 0}
        }
        )
        
        const products = store.products().map((product) =>
        product._id === productId ? {...product , sizes : sizesToUpdate} : product
        )

        patchState(store , {products , product : null})
    },

    getQueryFilters(limit : number , select? : string): void {
        activatedRoute.queryParamMap.pipe(
        tap((params) => {
        const filter = this.extractFiltersFromParams(params);
        const pageQuery = +(params.get('page') ?? '1');
        this.getProducts(pageQuery, limit, filter , select);
        }),
        takeUntilDestroyed()
        ).subscribe();
    },

    extractFiltersFromParams(params: ParamMap) : QueryFilter{
    const parseNumber = (value: string | null, fallback = 0) =>
    value !== null && !isNaN(+value) ? +value : fallback;
    return {
    category: params.getAll('category') as ProductCategory[],
    gender: params.getAll('gender') as Gender[],
    type: params.getAll('type'),
    fitType: params.getAll('fitType'),
    color: params.getAll('color'),
    tags: params.getAll('tags') as Tags[],
    sort : params.get('sort') as  Sort,
    minPrice: parseNumber(params.get('min')),
    maxPrice: parseNumber(params.get('max')),
    };
    },




    }
    })

)