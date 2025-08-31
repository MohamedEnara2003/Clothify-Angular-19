import { Component, inject, OnDestroy} from '@angular/core';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { CollectionsStore } from '../../../../../store/products/collections.signal';
import { ShowCollectionsComponent } from "../components/show-collections.component";
import { NavCheckLinksComponent } from "../../../shared/components/nav-check-links/nav-check-links.component";
import { ConfirmPopupService } from '../../../../../core/services/confirm-popup.service';
import { CheckDataService } from '../../../../../core/services/check-data.service';
import { CheckAllComponent } from "../../../shared/components/check-all/check-all.component";



@Component({
  selector: 'app-collections-for-home',
  imports: [SharedModule, ShowCollectionsComponent, NavCheckLinksComponent, CheckAllComponent],
  template: `
  <section aria-label="Collections for Home Page" role="region"
  class="w-full h-[90svh] bg-white flex flex-col  items-start gap-5  ">

  <h1 aria-label="Title Product Management Page" 
    class="w-full text-center text-lg xs:text-2xl sm:text-3xl font-bold text-neutral"> 
    {{'dashboard.Collections Management' | translate}}
  </h1>

  <header class="w-full flex justify-between items-center  z-10">
  <button  type="button"  role="button" aria-label="Button Create Product"
  routerLink="/dashboard/collections/upsert-collection"
  class="btn btn-md btn-secondary uppercase">
  <span class="material-icons">add</span>
  {{'dashboard.Create Collection' | translate}}
  </button>

  <app-nav-check-links (confirm)="confirmDeleteCollections()" />
  </header>

  <header class="w-full bg-neutral-content py-2 p-1 flex justify-between items-center  z-10">
  <app-check-all />
  </header>


  <section class="size-full pb-8 overflow-y-auto p-1">
  <app-show-collections  [isDashboard]="true" />
  </section>
  

  </section>  
  `,
})
export class CollectionsForHomeComponent implements OnDestroy{
private readonly confirmPopupService = inject(ConfirmPopupService);
readonly collectionsStore = inject(CollectionsStore);
readonly checkDataService = inject(CheckDataService);


confirmDeleteCollections() : void {
const collectionsIds = this.checkDataService.valueIds();
this.confirmPopupService.confirm({
  message : this.checkDataService.isCheckAllData() ? 'delAllCollectionsMsg' : 'delCollectionsMsg',
  icon : 'info' ,
  accept : () => {
  this.collectionsStore.deleteCollections(collectionsIds);
  this.checkDataService.clearAllChecks();
  },
  reject : () => this.checkDataService.clearAllChecks(),
  
})
}

  ngOnDestroy(): void {
  this.checkDataService.clearAllChecks();
  }

}
