import { Component, computed, inject, signal } from '@angular/core';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { MenuLinksComponent } from "./components/menu-links.component";
import { MenuStore } from '../../../../../../store/products/menu.signal';

@Component({
  selector: 'app-main-nav',
  imports: [SharedModule, MenuLinksComponent],
  template: `
<nav aria-label="Main Navigation" role="navigation" class="size-full">
  
  <app-menu-links  
  [items]="selectGender() ? categories() : genders()"
  [selectItem]="selectGender()" (selectItemChange)="selectGender.set($event!)">
    
  <li class="w-full" role="none">
    <a (click)="isOpenTypes.set(true)"
    class="w-full hover:text-secondary 
    flex justify-between items-center gap-2"
    role="menuitem"
    [attr.aria-haspopup]="true"
    [attr.tabindex]="0"
    aria-label="fitType">
    
    {{ 'navigation.fitType' | translate }}
    <span class="material-icons-outlined" style="font-size: 1.2rem;">east</span>
    </a>
    </li>

    <li role="none" class="w-full">
      <a 
        [routerLink]="'/main/collections'" 
        routerLinkActive="link-active" 
        class="w-full hover:text-secondary 
        flex justify-between items-center gap-2"
        role="menuitem"
        aria-label="All Collections"
      >
        {{'main.All Collections' | translate}}
      </a>
      
    </li>
  </app-menu-links>


@if (selectCategoryTypes().length > 0 && selectCategory()) {
<article class="absolute top-0 left-0 flex flex-col   items-center gap-10 p-4
z-50 size-full bg-white animate-sideLeft">
<header class="w-full flex justify-between items-center">
  <h2 class="capitalize text-lg font-semibold">{{openCategories()}} - {{selectCategory()}}</h2>
  <button type="button" class="material-icons btn btn-circle btn-sm" (click)="closeMenu()">
  close
  </button>
  </header>

            <ul 
                    [id]=" 'types-menu-' + selectCategory() "
                    (click)="selectCategory.set('')  ; selectCategoryTypes.set([]) " 
            class="w-full flex flex-col  justify-center items-center gap-5 text-lg text-neutral  capitalize"
            role="menu"
                    [attr.aria-label]="selectCategory() + ' Types'"
                  >
                    @for (type of selectCategoryTypes(); track type) {
                      <li class="w-full relative" role="none">
                        <a 
                          (click)="closeMenu()"
                          class="w-full hover:bg-secondary hover:text-secondary-content duration-300 transition-all
                          flex items-center gap-2 p-1 rounded"
                          role="menuitem"
                          [routerLink]="['/main/collections']"
                          [queryParams]="{gender: openCategories(), category: selectCategory(), type}"
                          [attr.tabindex]="0"
                          [attr.aria-label]="type + ' in ' + selectCategory()"
                        >
                          {{ 'type.' + type | translate}}
                        </a>
                      </li>
                    }
                  </ul>

                  <div></div>
        </article>
    }



  @if(isOpenTypes()) { 
  <article class="absolute top-0 left-0 flex flex-col   items-center gap-10 p-4
  z-30 size-full bg-white animate-sideLeft">

  <header class="w-full flex justify-between items-center">
  <h2 class="capitalize text-lg font-semibold">{{'main.Go To' | translate}} {{openCategories()}}</h2>
  <button type="button" class="material-icons btn btn-circle btn-sm" (click)="closeMenu()">
  close
  </button>
  </header>

      <ul 
            [id]="'category-menu- ' + openCategories() "
            class="w-full flex flex-col  justify-center items-center gap-5 text-lg text-neutral font-bold capitalize"
            role="menu"
            [attr.aria-label]="openCategories()  + ' Categories'"
            >
            @for (type of types(); track type) {
        <li class="w-full relative" role="none">
        @let menuByFit = menuStore.menu()?.byFit! ;
        <a  (click)="selectTypeFitTypes.set(menuByFit[type])"
        class="w-full hover:text-secondary 
        flex justify-between items-center gap-2"
        role="menuitem"
        [attr.aria-haspopup]="true" >

        {{'type.' + type | translate }}
      <span class="material-icons-outlined" style="font-size: 1.2rem;">east</span>
      </a>

    </li>
    }
    </ul>
    <div></div>
  </article>
}

@if (selectTypeFitTypes().length > 0) {
<article class="absolute top-0 left-0 flex flex-col   items-center gap-10 p-4
z-50 size-full bg-white animate-sideLeft">
<header class="w-full flex justify-between items-center">
  <h2 class="capitalize text-lg font-semibold">{{openCategories()}} - {{selectCategory()}}</h2>
  <button type="button" class="material-icons btn btn-circle btn-sm" (click)="closeMenu()">
  close
  </button>
  </header>

            <ul 
            [id]=" 'types-menu-' + selectCategory() "
            (click)="selectCategory.set('')  ; selectCategoryTypes.set([]) " 
            class="w-full flex flex-col  justify-center items-center gap-5 text-lg text-neutral  capitalize"
            role="menu"
                    [attr.aria-label]="selectCategory() + ' Types'"
                  >
                    @for (fitType of selectTypeFitTypes(); track fitType) {
                      <li class="w-full relative" role="none">
                        <a 
                          (click)="closeMenu()"
                          class="w-full hover:bg-secondary hover:text-secondary-content duration-300 transition-all
                          flex items-center gap-2 p-1 rounded"
                          role="menuitem"
                          [routerLink]="['/main/collections']"
                          [queryParams]="{gender: openCategories(), category: selectCategory(), fitType}"
                          [attr.tabindex]="0"
                          [attr.aria-label]="fitType + ' in ' + selectCategory()"
                        >
                          {{ 'fitType.' + fitType | translate}}
                        </a>
                      </li>
                    }
                  </ul>

       
        </article>
    }

</nav>
  `,
})
export class MainNavComponent {
  readonly menuStore = inject(MenuStore);
  
  

  selectGender = signal<string>('');

  categories  = computed<string[]>(() => {
    const menu = this.menuStore.menu();
    if (menu) {
    return  menu.byGender[this.selectGender()].map(({category}) => category) || [];
    }
    return [];
  });

  openCategories = signal<string>('');

  selectCategory = signal<string>('');
  selectCategoryTypes = signal<string[]>([]);


  genders = computed(() => 
  Object.keys(this.menuStore.menu()?.byGender || {}).map((gender) => `${gender}`));

  isOpenTypes = signal<boolean>(false)
  types = computed(() => Object.keys(this.menuStore.menu()?.byFit || {}));
  selectTypeFitTypes = signal<string[]>([]);


  constructor() {
  this.menuStore.getCollections();
  }

  closeMenu() : void {
    this.openCategories.set('');
    this.selectCategory.set('');
    this.selectCategoryTypes.set([]);
    this.selectTypeFitTypes.set([]);
  }
}
