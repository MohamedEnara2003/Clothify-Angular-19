import { Component, inject } from '@angular/core';
import { WishlistStore } from '../../../../../store/wishlist/wishlist.signal';
import { ProductCard } from "../../products/components/product-card";
import { MsgEmptyComponent } from "../../../shared/components/msg-empty/msg-empty.component";
import { UserActivityHeaderComponent } from "../../../shared/components/user-activity-header/user-activity-header.component";
import { SharedModule } from '../../../../../shared/modules/shared.module';

@Component({
  selector: 'app-wishlist',
  imports: [ProductCard, MsgEmptyComponent, UserActivityHeaderComponent, SharedModule],
  template: `
  <section aria-label="Section Wishlist" role="section" class="w-full grid grid-cols-1 gap-5">
  <app-user-activity-header [title]="'wishlist.Wishlist' | translate" [count]="wishlistStore.wishlistCount()" />
  @if (wishlistStore.wishlistCount() === 0) {
  <app-msg-empty msg="wishlist.Your wishlist is empty!" />
  }@else {
  <ul aria-label="List Wishlist" role="list" class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
  @for (product of wishlistStore.wishlist(); track product._id) {
  <li aria-label="Item Wishlist" role="listitem">
  <app-product-card [product]="product" />
  </li>
  }
  </ul>
  }
  </section>
  `,
})
export class WishlistComponent {
  readonly wishlistStore = inject(WishlistStore);

  ngOnInit(): void {
  this.wishlistStore.getWishlist()
  }


}
