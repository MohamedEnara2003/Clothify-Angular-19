import { Component, computed, effect, inject, input } from '@angular/core';
import { CollectionsStore } from '../../../../../store/products/collections.signal';
import { ProductsSlider } from "../../../../main/pages/products/components/products-slider";
import { LoadingSpinner } from "../../../../main/shared/components/loading/loading-spinner";
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { LanguageService } from '../../../../../core/services/translations/language.service';
import { TableEmptyComponent } from "../../../shared/components/table-empty/table-empty.component";
import { CheckDataService } from '../../../../../core/services/check-data.service';

@Component({
  selector: 'app-show-collections',
  imports: [SharedModule, ProductsSlider, LoadingSpinner, TableEmptyComponent],
  template: `
  <article aria-label="Products collections" role="article" class="w-full grid grid-cols-1 gap-15">
  @for (collection of collectionsStore.collections(); let i = $index ; track collection._id) {
  @defer (on viewport) {

  @let title = languageService.currentLanguage() === 'en' ? collection.titleEn : collection.titleAr ;
  <app-products-slider
  [title]="title"
  [products]="collection.products"
  [queries]="collection.queries"
  [isHide]="isDashboard()"
  > 

  @if(isDashboard()){
  <header class="flex items-center gap-2">
  <input type="checkbox" 
  [name]="'check-collection' + title" 
  [id]="'check-collection' + title"
  class="checkbox checkbox-neutral"
  (change)="checkDataService.onCheckData(collection._id || '')"
  [checked]="checkDataService.valueIds().includes(collection._id || '')"
  >
  <button [title]="('dashboard.View Collection' | translate) + ' ' + ( i + 1)"
  [routerLink]="['/dashboard/collections/upsert-collection' , collection._id]"
  type="button" role="button" aria-label="Button View Collection"
  class="material-icons btn btn-sm btn-circle text-secondary">
  visibility
  </button>
  </header> 
  }

</app-products-slider>
  }@placeholder {
  <app-loading-spinner class="w-full h-100 bg-neutral-300"/>
  }
  }@empty {
  @if(isDashboard()){
  <app-table-empty 
  message="messageCollectionsEmpty" 
  paragraph="paragraphCollectionsEmpty" 
  icon="collections" 
  class="w-full"/>
  }

  }
  </article>
  `,
})
export class ShowCollectionsComponent {
readonly collectionsStore = inject(CollectionsStore);
readonly languageService = inject(LanguageService);;
readonly checkDataService = inject(CheckDataService);;
isDashboard = input(false);

collectionsIds = computed<string[]>(() => 
this.isDashboard() ? this.collectionsStore.collections().map(({_id}) => _id || '' ) : []);

constructor(){
effect(() => {
  if(this.isDashboard()){
  this.checkDataService.initAllDataIds(this.collectionsIds())
  }
})
this.collectionsStore.getCollections();
}

}
