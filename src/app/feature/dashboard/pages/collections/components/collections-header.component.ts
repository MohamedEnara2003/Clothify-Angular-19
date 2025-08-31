import { Component, input } from '@angular/core';
import { SharedModule } from '../../../../../shared/modules/shared.module';

@Component({
  selector: 'app-collections-header',
  imports: [SharedModule],
  template: `
 <header class="flex items-center gap-2" role="heading" aria-label="Upsert Form Header">
  
        <a routerLink="/dashboard/collections" href="/dashboard/collections" role="link"  
        class="btn btn-circle btn-ghost"
        aria-label="Back to collections Management Page">
        <span class="material-icons text-secondary hover:text-secondary/90 duration-200 transition-colors"
        style="font-size: 2rem;">
        keyboard_backspace
        </span>
        </a>

      <h1 id="Collection-form-title" class="text-xl sm:text-2xl font-bold text-neutral">
      {{'dashboard.' + (!isExistingCollection()  ? 'Create Collection' : 'Update Collection') | translate}}
      </h1>
    </header>
  `,

})
export class CollectionsHeaderComponent {
  isExistingCollection = input(false);
}
