import {patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import {inject } from "@angular/core";
import {takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {catchError, of, tap } from "rxjs";
import {CollectionInfo, ProductsCollectionForHome } from "../../core/interfaces/collections.interface";
import {CollectionsService } from "../../feature/dashboard/pages/collections/service/collections.service";
import {Router } from "@angular/router";





interface ProductsState {
    collections : ProductsCollectionForHome[];
    loading : boolean ,
    error : string | null,
}

const initialState : ProductsState= {
    collections : [] ,
    loading : false ,
    error : null 
}

export const CollectionsStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),

    withMethods((store) => {
    const collectionService = inject(CollectionsService);
    const router = inject(Router);
    return {

    getCollections :  () : void  => {
    if(store.collections().length > 0) return ;
    patchState(store , {loading : true});
    collectionService.getCollections().pipe(
    tap(({data}) => {
    const collectionsProductIds = data.flatMap((collection) =>
    ({...collection ,  products : collection.products.flatMap((p) => p.productId)})
    );
    patchState(store , {loading : false , collections : collectionsProductIds })
        
    }),
    catchError(({error}) => {
    patchState(store , {loading : false , error : error.message || 'something went wrong'})
    return of([])
    }), takeUntilDestroyed()
    ).subscribe();
    },
    

    createCollection : (collectionInfo : CollectionInfo ,  products: Array<{ productId: string; }>) : void => {
    collectionService.createCollection(collectionInfo , products ).pipe(
    tap(({data}) => {
    const collections = 
    [{...data , products : data.products.flatMap((p) => p.productId)} , ...store.collections()];
    patchState(store , {collections});
    router.navigateByUrl('/dashboard/collections')
    })
    ).subscribe();
    },

    updateCollection : (id : string , collectionInfo : CollectionInfo ,  products: Array<{ productId: string}>) : void => {
    collectionService.updateCollection(id , collectionInfo , products ).pipe(
    tap(({data}) => {
    if (!data) return;
    const updatedCollection = {...data, products: data.products.flatMap((p) => p.productId),};
    const collections = store.collections().map((c) =>
    c._id === updatedCollection._id ? updatedCollection : c );

    patchState(store, { collections });
    router.navigateByUrl('/dashboard/collections')
    })
    ).subscribe();
    },
    
    deleteCollections(ids: string[]) : void {
    collectionService.deleteCollection(ids).pipe(
    tap(() => {
    const collections = store.collections().filter(({_id}) => !ids.includes(_id || ''));
    patchState(store , {collections});
    })
    ).subscribe()
    }
    } 
    })
)