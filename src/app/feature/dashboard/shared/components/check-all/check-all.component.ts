import { Component, inject, input } from '@angular/core';
import { CheckDataService } from '../../../../../core/services/check-data.service';

@Component({
  selector: 'app-check-all',
  imports: [],
  template: `
      <input type="checkbox" role="checkbox" name="CheckAllData" class="checkbox checkbox-neutral" 
      (change)="checkDataService.onCheckAllData()"
      [checked]="checkDataService.isCheckAllData()"
      [disabled]="isDisabled()"
      />
  `,
})
export class CheckAllComponent {
  readonly checkDataService = inject(CheckDataService);
  isDisabled = input<boolean>(false)
}
