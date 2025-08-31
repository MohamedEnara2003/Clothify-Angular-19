import { Component } from '@angular/core';
import { SharedModule } from '../../../../../../shared/modules/shared.module';


@Component({
  selector: 'app-wishlist-link',
  imports: [SharedModule],
  template: `
    <a [title]="'links.wishlist' | translate " 
    aria-label="Wishlist Link" role="link" href="/main/wishlist" routerLink="/main/wishlist" 
    class="flex flex-col items-center text-neutral md:text-neutral-content " 
    routerLinkActive="text-secondary md:text-secondary">
      <span class="material-icons-outlined"style="font-size: 1.8rem;"> favorite_border </span>
      <span aria-hidden="true" class="md:hidden">{{ 'links.wishlist' | translate }}</span>
    </a>
  `,
})
export class WishlistLink {

} 
