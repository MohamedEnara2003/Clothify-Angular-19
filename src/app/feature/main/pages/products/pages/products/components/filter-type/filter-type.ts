import { Component, inject, input, model, OnDestroy, OnInit, signal} from '@angular/core';
import { SharedModule } from '../../../../../../../../shared/modules/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-filter-type',
  imports: [SharedModule],
  template: `
  <section aria-label="Section Filter Type" role="section" 
  class="w-full flex flex-col justify-center items-center  gap-2 border-t border-neutral-400 
  border-dashed py-1">

    <button type="button" [attr.aria-label]="'button Filter Type' + title()" role="button" 
    class="w-full flex justify-between items-center   hover:bg-neutral-content rounded cursor-pointer
    duration-300 transition-all p-1"
    (click)="isOpen.set(!isOpen())">
    <h2 class="text-neutral capitalize font-bold  text-lg ">{{'labels.' + title() | translate}}</h2>
    <span class="material-icons transition-all duration-300 text-neutral " 
    [ngClass]="!isOpen() ? 'rotate-0' : 'rotate-90'">keyboard_arrow_right</span>
    </button>

  @if(isOpen()){
  <nav aria-label="Nav Filter Type" role="navigation" 
  class="w-full  grid grid-cols-1 gap-1 animate-down " 
  [ngClass]="items().length > 6 ? 'h-50 overflow-y-scroll' : 'h-auto'">

  <ul aria-label="List Filter Type" role="list" class="flex flex-col gap-4 text-neutral">
      @for(item of items(); track item){
      <li aria-label="Item Filter Type" role="item" 
      class="flex items-center gap-2">
      @defer (on viewport) {
      <input type="checkbox" [name]="item" [id]="item" class="checkbox rounded checkbox-md  checkbox-neutral"
      (change)="addQueryParams(item)" 
      [checked]="selectedItems().includes(item)">

      <label [for]="item" class="text-sm uppercase hover:text-secondary duration-300 transition-all 
      cursor-pointer ">
      {{ title() !== 'color' ? (title() + '.' + item | translate) : item }}
      </label>

      } @placeholder {
      <li aria-label="Item Filter Type" role="item" class="w-full flex items-center gap-2">
      <div class="size-6 bg-neutral/30 rounded animate-pulse"></div>
      <label class="h-6 w-full bg-neutral/30 rounded animate-pulse"></label>
      </li>
      }
      </li>
      }
    </ul>
  </nav>
  }
  </section>
  `,
})
export class FilterType implements OnInit , OnDestroy{

  private destroy$ = new Subject<void>();
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  title = input<string>('');
  items = input<string[]>([]);
  isOpen = model<boolean>(false);

  selectedItems = signal<string[]>([]);

  addQueryParams(item: string) {
    const updated = this.selectedItems().includes(item)
      ? this.selectedItems().filter(i => i !== item)
      : [...this.selectedItems(), item];
  
    this.selectedItems.set(updated);
  
    this.router.navigate([], {
      queryParams: { [this.title()!]: updated , page : 1},
      queryParamsHandling: 'merge',
    });
  }

  ngOnInit(): void {
  this.getQueryItmes();
  }
  
  private getQueryItmes(): void {
    this.activatedRoute.queryParamMap.pipe(
      tap((params) => {
        const key = this.title(); 
        if(key){
          const values = params.getAll(key);
          this.selectedItems.set(values);
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
