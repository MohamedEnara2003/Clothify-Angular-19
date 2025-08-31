import { Component, inject, input, model } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../../../../../shared/modules/shared.module';

@Component({
  selector: 'app-select-filter',
  imports: [SharedModule],
  template: `
  <label class="select select-neutral bg-white text-neutral  w-full">
  <label class="label capitalize">{{label()}}</label>
  <select aria-label="dashboard.Select Filter" role="combobox" (change)="selectItem($event)"
  class="uppercase">
  @for (item of filterItems(); track item) {
  <option [value]="item" [selected]="selectedItem() === item" >{{item | translate}}</option>
  }
  </select> 
  </label>
  `,
})
export class SelectFilterComponent {
  label = input<string>('dashboard.Select Filter');
  filterItems = input.required<(string)[]>();
  selectedItem = model<string>('');
  private readonly router = inject(Router);
  
  selectItem (event : Event) : void {
    const item = (event.target as HTMLSelectElement).value;
    this.router.navigate([], {
    queryParams: {[this.label()]: item === this.filterItems()[0]  ? null : item} , 
    queryParamsHandling: 'merge'
    });
  }
}
