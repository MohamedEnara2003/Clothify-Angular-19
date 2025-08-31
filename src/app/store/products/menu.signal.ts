import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { inject } from "@angular/core";
import { ProductsService } from "../../feature/dashboard/pages/products/service/products";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { tap } from "rxjs";
import { CollectionsResponse } from "../../core/interfaces/collections.interface";



interface MenuState {
menu : CollectionsResponse | undefined
}

const initialState : MenuState = {
menu : undefined
}

export const MenuStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),

    withMethods((store) => {
    const productsService = inject(ProductsService)
    return {

    getCollections :  () => {
        productsService.getProductsCollections().pipe(
        tap(({data}) => {
        patchState(store , {menu : data})
        }),
        takeUntilDestroyed()
        ).subscribe()
    },

    

    }
    })
)