import { Component, inject, input } from '@angular/core';
import { WishlistStore } from '../../../../../store/wishlist/wishlist.signal';
import { Product } from '../../../../../core/interfaces/products.interface';
import { SharedModule } from '../../../../../shared/modules/shared.module';

@Component({
  selector: 'app-btn-add-to-wishlist',
  imports: [SharedModule],
  template: `
  <button (click)="wishlistStore.toggleWishlist(product())"  aria-label="Add to Favorite" role="button"
  title="Add to Favorite" type="button" class="text-neutral -rotate-25 cursor-pointer">
    @let isInWishlist = wishlistStore.isInWishlist(product()._id!);
    <span aria-label="Icon Add to Wishlist" aria-hidden="true" role="span"
    [ngClass]="isInWishlist ? 'text-secondary' : 'text-neutral/50'"
    class="material-icons cursor-pointer hover:text-secondary transition-all duration-300" style="font-size: 1.2rem;">
    {{isInWishlist ? 'favorite' : 'favorite_border'}}
    </span>
  </button>
  `,
})
export class BtnAddToWishlistComponent {
  readonly wishlistStore = inject(WishlistStore);
  product = input.required<Product>();
}
