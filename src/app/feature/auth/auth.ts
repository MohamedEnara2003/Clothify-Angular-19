import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavListItemsComponent } from "../main/shared/components/navigations/nav-list-items/nav-list-items.component";
import { SelectLangComponent } from "../../shared/components/translation/select-lang.component";
import { NgImageComponent } from "../../shared/components/ng-image/ng-image.component";

@Component({
  selector: 'app-authentication',
  imports: [RouterOutlet, NavListItemsComponent, SelectLangComponent, NgImageComponent],
  template: `
  <section class="relative w-full h-svh grid grid-cols-1 lg:grid-cols-2 bg-white" 
  aria-label="Authentication Page" role="region">

  <header class="w-full absolute top-0 left-0  z-50 flex items-center gap-4 p-4">
  <app-nav-list-items  />
  <app-select-lang />
  </header>

    <app-ng-image
        [options]="{
        src : authBanner,
        alt : 'Authentication Banner Image',
        width :  700 , 
        height : 700 ,
        class : 'w-full h-full object-contain' ,
        loading : 'eager' ,
        decoding : 'async' ,
        fetchpriority  : 'high'
        }"
        class="w-full h-screen absolute left-0 top-0 z-0 lg:relative" 
        />

  <main aria-label="Authentication Routes" class="size-full flex flex-col justify-center items-center  z-5">
  <router-outlet />
  </main>
  </section>
  `,
})
export class Authentication {
  public authBanner : string = "https://res.cloudinary.com/dphfyg0f8/image/upload/v1754708005/20602935_6333204_uq9dvn.webp";
}
