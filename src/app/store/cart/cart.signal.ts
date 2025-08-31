import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals"
import { Cart, CartProduct, CartProductSize, CartWithProduct } from "../../core/interfaces/carts.interface"
import { computed, inject } from "@angular/core"
import { CartService } from "../../feature/main/pages/cart/service/cart"
import { catchError, of, tap } from "rxjs"
import { takeUntilDestroyed } from "@angular/core/rxjs-interop"
import { AuthStore } from "../auth/auth.signal"
import { HttpErrorResponse } from "@angular/common/http"
import { Router } from "@angular/router"



interface cartState {
    userCart : CartWithProduct | null;
    userCartProduct : CartProduct | null;
    isLoading : boolean ,
    error : string | null
}

const initialState : cartState = {
    userCart : null,
    userCartProduct : null,
    isLoading : false,
    error : null
}
export const CartStore= signalStore(
    {providedIn : 'root'},
    withState(initialState),
    withComputed((store) => {
        
    return {
    cartCount : computed(() => store.userCart()?.products.reduce((acc , product) => acc + product.quantity , 0) || 0),
    cartTotal : computed(() => store.userCart()?.products.reduce((prev , product) => 
    prev += product.productId.final_price! * product.quantity ,0) || 0
    ),
    }
    }),
    withMethods((store) => {
    const cartService = inject(CartService);
    const authStore = inject(AuthStore);
    const router = inject(Router);
    return {

    addToCart  (productId : string , quantity : number ,  selectedSize? : CartProductSize ) : void {
    const userId = authStore.user()?.id;
    if(!userId)  {
    router.navigate(['/auth/register'])
    return
    }

    const cart : Cart = {
    userId, 
    productId,
    quantity,
    selectedSize,
    }  
    
    cartService.addProductToCart(cart).pipe(
    tap(({data : userCart }) => patchState(store , {userCart : userCart }))).subscribe();
    },


    getUserCart : () => {
    const userId = authStore.user()?.id;
    if(!userId || store.userCart()) return;
    patchState(store , {isLoading : true})
    cartService.getUserCart(userId).pipe(
    tap(({data : userCart}) => patchState(store , {userCart ,isLoading : false})),
    catchError(({error} : HttpErrorResponse) => {
    patchState(store , {error : error.message ,isLoading : false})
    return of(null)
    }),takeUntilDestroyed()
    ).subscribe();
    },

    updateQuantity (cartId : string , productId : string , size : CartProductSize | null, quantity : number) : void {
        const userId = authStore.user()?.id;
        if(!userId) return;
        cartService.updateQuantity(cartId  , userId , size , productId , quantity).pipe(
        tap(() => {
        const cartProducts = store.userCart()?.products;
        if(!cartProducts) return;

    const updatedCartProducts = cartProducts.map(product => {
    const dbProductId = product.productId?._id

    const dbSizeId = product.selectedSize?.size_id || null;
    const reqSizeId = size?.size_id || null;

    const isSize = reqSizeId ? dbSizeId === reqSizeId : true;

    return dbProductId === productId && isSize ? { ...product, quantity }  : product;
});


  patchState(store , {userCart : { ...store.userCart()! ,products : updatedCartProducts}});
}
        ),
        ).subscribe();
    },

    updateSize (cartId: string, size: CartProductSize, productId: string) : void {
        const userId = authStore.user()?.id;
        if(!userId || !size) return;
        cartService.updateSize(cartId , userId , productId , size )
        .pipe(tap(({data : userCart}) => patchState(store , {userCart}))).subscribe();
    },
    

deleteProductFromCart: (cartId: string, productId: string, size_id: string | null) => {
  cartService.removeProductFromCart(cartId, productId, size_id).pipe(
    tap(() => {
      const cartProducts = store.userCart()?.products;
      if (!cartProducts) return;

      const updatedCartProducts = cartProducts.filter(product => {
        const dbProductId = product.productId?._id?.toString();
        const dbSizeId = product.selectedSize?.size_id || null;

        return !(dbProductId === productId && (size_id ? dbSizeId === size_id : true));
      });

      patchState(store, { 
        userCart: { ...store.userCart()!, products: updatedCartProducts }
      });
    })
  ).subscribe();
},


    getUserCartProduct : (productId : string , size_id : string | null) => {  
    const cartProducts = store.userCart()?.products ;
    if(!cartProducts || cartProducts.length === 0) return;

    const userCartProduct = cartProducts.find((product) =>  {
    const {selectedSize , productId : {_id}} = product ;
    return _id === productId && selectedSize ?  selectedSize.size_id === size_id : !size_id
    });
    patchState(store , {userCartProduct});
    },
    
    removeUserCartProduct  () : void {
    patchState(store , {userCartProduct : null});
    },

    removeUserAllCartProduct  () : void {
    patchState(store , {userCart : {...store.userCart()!, products : []}});
    }
    }
    })
)