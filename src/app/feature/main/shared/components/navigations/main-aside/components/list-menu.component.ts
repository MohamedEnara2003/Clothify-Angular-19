import { Component, computed, inject, signal } from '@angular/core';
import { SharedModule } from '../../../../../../../shared/modules/shared.module';
import { LanguageService } from '../../../../../../../core/services/translations/language.service';
import { MenuStore } from '../../../../../../../store/products/menu.signal';

@Component({
  selector: 'app-list-menu',
  imports: [SharedModule],
  template: `
<section class="w-full  ">
  @let currentLang = languageService.currentLanguage() ;
  @let arrow = currentLang  === 'en'  ? 'rotate-0' : 'rotate-180';
  @let animate = currentLang === 'en' ? 'animate-sideRight' : 'animate-sideLeft';

<!-- main section -->
@if (!activeSection()) {
  <div class="flex flex-col flex-wrap gap-4">
    @for (gender of genders(); track gender) {
      <button
        class="w-full btn btn-lg flex justify-between items-center"
        (click)="selectSection(gender)"
      >
        {{ 'gender.' + gender | translate }}
        <span class="material-icons" [ngClass]="arrow">east</span>
      </button>
    }

    <button
      class="w-full btn btn-lg flex justify-between items-center"
      (click)="selectSection('fitTypes')"
    >
      {{ 'FitType'  }}
      <span class="material-icons" [ngClass]="arrow">east</span>
    </button>
  </div>
}


  <!-- gender section -->
@if (isGenderSection()) {
  <div class="absolute top-0 left-0 w-full h-full bg-white z-10 p-4 flex flex-col gap-4"
  [ngClass]="animate">
    <header>
      <button class="btn btn-lg" (click)="resetView()">
        <span class="material-icons" [ngClass]="arrow">arrow_back</span>
      </button>
    </header>
  @if (!selectedCategory()) {
    <nav>
    <h3 class="text-xl font-bold mb-3 capitalize">{{ activeSection() }} Categories</h3>
    <ul class="space-y-2">
      @for (category of categories(); track category) {
        <li>
          <button
            class="w-full btn btn-lg flex justify-between items-center"
            (click)="selectedCategory.set(category)"
          >
            {{ 'category.' + category | translate }}
            <span class="material-icons" [ngClass]="arrow">east</span>
          </button>
        </li>
      }
    </ul>
  </nav>
    }@else {
      <div class="mt-4" [ngClass]="animate">
        <h4 class="text-xl  font-bold mb-2">Types in {{ selectedCategory() }}:</h4>
        <ul class="space-y-2">
          @for (type of typesForSelectedCategory(); track type) {
            <li>
              <button class="w-full btn flex justify-between items-center"
              routerLink="/main/collections"
              [queryParams]="{gender: activeSection(), category: selectedCategory(), type: type}"
              >
                {{ 'type.' + type | translate }}
              </button>
            </li>
          }
        </ul>
      </div>
    }
  </div>
}

<!-- fitTypes section -->
@if (activeSection() === 'fitTypes') {
  <div class="absolute top-0 left-0 w-full h-full bg-white z-10 p-4 flex flex-col gap-4" [ngClass]="animate">
    <header>
      <button class="btn btn-lg" (click)="resetView()">
        <span class="material-icons" [ngClass]="arrow">arrow_back</span>
      </button>
    </header>
    @if (!selectFitType()) {
      <nav>
    <h3 class="text-xl font-bold mb-3">Fit Types</h3>
    <ul class="space-y-2">
      @for (type of fitTypeKeys(); track type) {
        <li>
          <button
            class="text-left w-full btn btn-lg flex justify-between items-center"
            (click)="selectFitType.set(type)"
          >
            {{ 'type.' + type | translate }}
            <span class="material-icons" [ngClass]="arrow">east</span>
          </button>
        </li>
      }
    </ul>
      </nav>
    }@else {
    @if (selectFitType()) {
      <div class="mt-4" [ngClass]="animate">
        <h4 class="text-xl  font-bold mb-2">Types under {{ selectFitType() }}:</h4>
        <ul class="space-y-2">
          @for (fitType of fitTypes(); track fitType) {
            <li>
              <button class="w-full btn flex justify-between items-center"
                routerLink="/main/collections"
                [queryParams]="{type: selectFitType(), fitType: fitType}"
              >
                {{ 'fitType.' + fitType | translate }}
              </button>
            </li>
          }
        </ul>
      </div>
    }
    }
  </div>
}

</section>

  `,
})
export class ListMenuComponent {
  readonly menuStore = inject(MenuStore) ;
  readonly languageService = inject(LanguageService);

  genders = computed(() =>
    Object.keys(this.menuStore.menu()?.byGender || {})
  );

  fitTypeKeys = computed(() =>
    Object.keys(this.menuStore.menu()?.byFit || {})
  );


  activeSection = signal<string | null>(null);
  selectedCategory = signal<string | null>(null);
  selectFitType = signal<string | null>(null);


  selectSection(section: string) {
    this.activeSection.set(section);
    this.selectedCategory.set(null);
    this.selectFitType.set(null);
  }

  resetView() {
    this.activeSection.set(null);
    this.selectedCategory.set(null);
    this.selectFitType.set(null);
  }

  isGenderSection = computed(() =>
    this.activeSection() && this.activeSection() !== 'fitTypes'
  );

  
  categories = computed(() => {
    const gender = this.activeSection();
    return this.menuStore.menu()?.byGender[gender!]?.map(c => c.category) || [];
  });


  typesForSelectedCategory = computed(() => {
    const gender = this.activeSection();
    const category = this.selectedCategory();
    if (!gender || !category) return [];

    const categoryObj = this.menuStore.menu()
      ?.byGender[gender]
      ?.find(c => c.category === category);

    return categoryObj?.items || [];
  });


  fitTypes = computed(() =>
    this.menuStore.menu()?.byFit[this.selectFitType()!] || []
  );

  constructor() {
    this.menuStore.getCollections();
  }
}
