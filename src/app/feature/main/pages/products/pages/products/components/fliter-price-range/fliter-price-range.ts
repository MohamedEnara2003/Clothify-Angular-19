import { Component, computed, inject, input, model, signal } from '@angular/core';
import { SharedModule } from '../../../../../../../../shared/modules/shared.module';
import { Router } from '@angular/router';
import { LabelType, Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-fliter-price-range',
  imports: [SharedModule],
  template: `
    <section aria-label="Section Fliter Price Range" role="section" 
    class="w-full flex flex-col justify-center    gap-4 border-t border-neutral-400  border-dashed py-4">

    <button type="button" [attr.aria-label]="'button Filter Price Range'" role="button" 
    class="text-neutral w-full flex justify-between items-center   hover:bg-neutral-content rounded cursor-pointer
    duration-300 transition-all p-1"
    (click)="isOpen.set(!isOpen())">
    <h2 class="capitalize font-bold  text-lg">{{'labels.PriceRange' | translate}}</h2>
    <span class="material-icons" [ngClass]="!isOpen() ? 'rotate-0' : 'rotate-90'">keyboard_arrow_right</span>
    </button>

    @if(isOpen()){
    @defer (on viewport ; when !isOpen()) {
    <nav aria-label="Nav Filter Price Range" role="navigation" 
    class="w-full flex flex-col justify-center items-center gap-4 animate-down">
    <ngx-slider 
    aria-label="Slider Filter Price Range"
    role="slider"
    [value]="minPrice()"
    [highValue]="maxPrice()" 
    [options]="options()" 
    (userChange)="onChangeQueryParams($event.value, $event.highValue ?? 100000)"
    />
    <button 
    (click)="applay()"
    type="button" role="button" class="w-full btn btn-sm btn-secondary">Applay</button>
    </nav>
    }@placeholder {
    <div class="w-full h-10 bg-neutral-content animate-pulse"></div>
    }
    }
    </section>
  `,
})
export class FliterPriceRange {
  private readonly router = inject(Router);
  isOpen = signal<boolean>(true);

  minPrice = input<number>(100);
  maxPrice = input<number>(100000);

  prices = signal<{min : number , max : number}>({min : this.minPrice() ,  max : this.maxPrice()});

  options = computed<Options>(() => ({
    floor:  this.minPrice(),
    ceil:  this.maxPrice(),
    step: 1,
    selectionBarGradient: {
    from: '#3B82F6',
    to: '#3B82F6'
    },
    getPointerColor: () => 'var(--color-neutral)',
    getSelectionBarColor: () => 'var(--color-neutral)',
    getTickColor: () => 'var(--color-neutral-content)',
  }))


  onChangeQueryParams(min : number , max : number){
  this.prices.set({min ,max});
  }

  applay() : void { 
  const {max , min}  = this.prices();
  this.router.navigate([], {
  queryParams : {min ,max} , queryParamsHandling : 'merge'});
  }
}
