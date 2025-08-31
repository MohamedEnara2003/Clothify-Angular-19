import {Component, inject } from '@angular/core';
import {Sort } from '../../../../../../../../core/interfaces/products.interface';
import {Router } from '@angular/router';

@Component({
  selector: 'app-select-sort',
  imports: [],
  template: `
    <nav aria-label="Nav Select Sort" role="navigation"
    class="w-full flex  justify-end items-center gap-2 text-neutral px-1">
    <label for="sort" class="label text-sm uppercase">Sort by </label>
    <select aria-label="Select Sort" role="select" name="sort" id="sort" 
    class="w-30 md:w-35 select select-xs sm:select-sm  select-neutral" (change)="onSort($event)">
    @for (s of sorts; track s.value) {
    <option [value]="s.value">{{s.name}}</option>
    }
    </select>
</nav>
  `,
})
export class SelectSort {
private readonly router = inject(Router);
readonly sorts : Array<{value : Sort , name : string}> = [
  {value :'Default' ,   name : 'Default'},
  {value :'Newest' ,    name : 'Newest'},
  {value :'Oldest' ,    name : 'Oldest'},
  {value :'LowtoHigh' , name : 'Price : Low to High'},
  {value :'HightoLow' , name : 'Price : High to Low'},
];

onSort(e: Event): void {
  const value = (e.target as HTMLSelectElement).value;
  this.router.navigate([] , {queryParams : {sort : value} , queryParamsHandling : 'merge'});
}

}
