import { Component, model } from '@angular/core';
import { SharedModule } from '../../../../../../../../shared/modules/shared.module';
import { SelectSort } from "../select-sort/select-sort";



@Component({
  selector: 'app-products-header',
  imports: [SharedModule, SelectSort],
  template: `
  <header aria-label="Header Products" role="header" 
  class="w-full grid grid-cols-1 gap-4 bg-neutral/20 p-2 rounded">

  <nav aria-label="Nav Products" role="navigation" 
  class="w-full text-neutral flex flex-col items-start gap-1">
  <ul class="flex justify-center items-center gap-1">
    <li>
    <a routerLink="/main/home" href="main/home" aria-label="Link Home" role="link"
      class="link link-hover hover:text-secondary duration-300 transition-all ease-in-out">
      {{'navigation.Home' | translate}}
    </a> 
    </li>
    /
    <li>
    <a routerLink="/main/collections"  href="/collections" aria-label="Link Products" role="link"
      class="link  link-hover font-semibold text-secondary duration-300 transition-all ease-in-out">
      {{'navigation.Products' | translate}} 
    </a>
    </li>
  </ul>
  </nav>
    
    <h1 class="w-full text-center  text-xl sm:text-2xl md:text-3xl font-bold text-neutral italic">
      {{'navigation.Products' | translate}}
    </h1>

  <nav  class="w-full flex justify-between md:justify-end items-center">
  <button (click)="isFilter.set(!isFilter())" type="button" role="button" aria-label="Button Filter" 
    class="btn btn-xs btn-neutral md:hidden">
    {{'buttons.Filter' | translate}}
    <span class="material-icons-outlined" style="font-size: 1.2rem;">filter_alt</span>
  </button>
  <app-select-sort />
  </nav>


  </header>
  `,

})
export class ProductsHeader {
  isFilter = model<boolean>(false);
}
