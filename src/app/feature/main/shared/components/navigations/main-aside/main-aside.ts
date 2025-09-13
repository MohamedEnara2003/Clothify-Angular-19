import { Component, Inject, inject, model, OnDestroy } from '@angular/core';
import { SharedModule } from '../../../../../../shared/modules/shared.module';
import { LanguageService } from '../../../../../../core/services/translations/language.service';
import { ListMenuComponent } from "./components/list-menu.component";
import { SelectLangComponent } from "../../../../../../shared/components/translation/select-lang.component";
import { DOCUMENT } from '@angular/common';
import { AppLinksService } from '../../../../../../core/services/app-links.service';

@Component({
  selector: 'app-main-aside',
  imports: [SharedModule, ListMenuComponent, SelectLangComponent],
  template: `

<section aria-label="Main Aside" role="section" 
class="w-full h-svh fixed top-0 left-0 z-[100] flex justify-start items-start">

  <aside aria-label="Main Aside" role="aside" 
  class="w-80 lg:w-120 h-full  bg-white shadow-xs shadow-neutral relative z-[100] p-5 text-neutral 
  flex flex-col justify-between gap-5 overflow-y-auto overflow-hidden"
  [ngClass]="languageService.currentLanguage() === 'en' ? 'animate-sideLeft' : 'animate-sideRight'">

  <header aria-label="Header Main Aside" role="heading" class="flex justify-between items-center">
  <h1 class="text-lg font-semibold">{{'main.Menu' | translate}}</h1>
  <button type="button" class="material-icons btn btn-circle btn-sm"   
  [routerLink]="['/main' , {outlets : { aside : null }}]">
  close
  </button>
  </header>


  <app-list-menu />

  <nav class="w-full grid grid-cols-1 gap-5">
  <ul class="w-full flex gap-4 flex-col">
  <h1 class="text-lg font-semibold">{{'main.My Account' | translate}}</h1>
  @for (link of appLinksService.profileLinks(); track link.path) {
  <li>
  <a [routerLink]="link.path" class="flex items-center gap-2">
  <span class="material-icons-outlined">{{link.icon}}</span>
  <span>{{'navigation.' + link.name | translate}}</span>
  </a>
  </li>
  }
  </ul>
  </nav>

  <app-select-lang />
  </aside>

  <div  [routerLink]="['/main' , {outlets : { aside : null }}]"
  aria-label="Main Aside Background" role="container"  class="size-full bg-neutral/70 fixed top-0 left-0 z-50">
  </div>
</section>

  `,
})
export class MainAside implements OnDestroy{
  readonly languageService = inject(LanguageService);
  readonly appLinksService = inject(AppLinksService);



  constructor(@Inject(DOCUMENT) private doc: Document){
  doc.body.style.overflow = 'hidden'
  }



ngOnDestroy(): void {
  this.doc.body.style.overflow = 'auto'
}


}
