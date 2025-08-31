import { Component, inject, input, model, output } from '@angular/core';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { CheckDataService } from '../../../../../core/services/check-data.service';

@Component({
  selector: 'app-nav-check-links',
  imports: [SharedModule],
  template: `
  @if(checkDataService.valueIds().length){ 
  <nav role="navigation" role="navigation"  class="flex justify-center items-center gap-2 animate-up"
  aria-hidden="true">  
  <button aria-label="Button Open Confirm Model" 
  type="button" role="button"  class="flex justify-center items-center gap-1 btn uppercase"
  (click)="confirm.emit()">
    <span class="material-icons text-error cursor-pointer">delete</span>
    <span>{{checkDataService.isCheckAllData() ?
    ('dashboard.All Items' | translate) : 
    ('dashboard.Item' | translate) + ' ' + checkDataService.valueIds().length}}</span>
  </button>

  <button aria-label="Button Cancel All Check from item ids"  
  type="button" role="button"  class="btn btn-sm btn-neutral uppercase"
    (click)="checkDataService.valueIds.set([])">
    {{'buttons.Cancel' | translate}}
  </button>
  </nav>
}
  `,
})
export class NavCheckLinksComponent {
  checkDataService = inject(CheckDataService);
  confirm = output<void>();

}
