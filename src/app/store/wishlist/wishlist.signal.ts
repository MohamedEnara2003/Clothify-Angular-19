import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";

import { computed, inject } from "@angular/core";

import { Product } from "../../core/interfaces/products.interface";
import { LocaleStorageService } from "../../core/services/locale-storage.service";

interface WishlistState {
    wishlist: Product[];
}

const initialWishlistState: WishlistState = {
    wishlist: [],
}

export const WishlistStore = signalStore(
    {providedIn : 'root'},
    withState(initialWishlistState),
    withComputed((store) => {
        return {
            wishlistCount: computed(() => store.wishlist().length),
        }
    }),
    withMethods((store) => {
        const wishlistKey = "Wishlist";
        const localStorage = inject(LocaleStorageService);
        return {
            getWishlist(): void {
                    const products = localStorage.getItem<Product[]>(wishlistKey);
                    if (products && Array.isArray(products)) {
                    patchState(store, { wishlist: products });
                    } else {
                    patchState(store, { wishlist: [] });
                    }
            },

            addToWishlist(product: Product): void {  
                    const currentWishlist = store.wishlist() || [];
                    if (!Array.isArray(currentWishlist)) {
                        patchState(store, { wishlist: [product] });
                        localStorage.setItem(wishlistKey, [product]);
                        return;
                    }

                    const isExisting = currentWishlist.some(item => item._id === product._id);
                    if (!isExisting) {
                        const newWishlist = [...currentWishlist, product];
                        localStorage.setItem(wishlistKey, newWishlist);
                        patchState(store, { wishlist: newWishlist });
                    }
                
            },

            removeFromWishlist(product: Product): void {
                    const currentWishlist = store.wishlist() || [];
                    if (!Array.isArray(currentWishlist)) {
                        patchState(store, { wishlist: [] });
                        localStorage.setItem(wishlistKey, []);
                        return;
                    }

                    const newWishlist = currentWishlist.filter(item => item._id !== product._id);
                    localStorage.setItem(wishlistKey, newWishlist);
                    patchState(store, { wishlist: newWishlist });
                
            },

            toggleWishlist(product: Product): void {
                    const currentWishlist = store.wishlist() || [];
                    if (!Array.isArray(currentWishlist)) {
                        this.addToWishlist(product);
                        return;
                    }

                    const isExisting = currentWishlist.some(item => item._id === product._id);

                    if (isExisting) {
                    return this.removeFromWishlist(product);
                    } 
                    this.addToWishlist(product);        
            },

            isExistingWishlist(product: Product): boolean {
            const currentWishlist = store.wishlist() || [];
            return Array.isArray(currentWishlist) && currentWishlist.some(item => item._id === product._id);
            },
        
        isInWishlist(productId : string) : boolean {
        const wishlist = store.wishlist();
        if (!wishlist || !productId) return false;
        return  wishlist.some(item => item._id === productId);
        }
        
        }
    })
)