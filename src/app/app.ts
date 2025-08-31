import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmPopup } from "./shared/components/confirm-popup/confirm-popup";
import { AuthStore } from './store/auth/auth.signal';
import { VisitorsService } from './core/services/visitors.service';
import { LanguageService } from './core/services/translations/language.service';
import { AlertService } from './core/services/alert.service';
import { AlertComponent } from "./shared/components/alert/alert.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConfirmPopup, AlertComponent],
  template : `
  <section class="w-full bg-white overflow-hidden" aria-label="App Page" role="application">

  <!-- Alert And confirm Popup -->
  @if(alertService.alertOption().length > 0){
  <nav role="navigation"
  class="w-full fixed top-2 left-0  z-[100] flex flex-col items-center  sm:items-end gap-2 p-5 sm:px-8">
  @for (alert of alertService.alertOption(); track alert.id) {
  <app-alert class="w-[95%] sm:w-100" [alertOption]="alert"/>
  }
  </nav>
  }
  
  <app-confirm-popup />  
  

  <main aria-label="App Routes" role="main">
  <router-outlet />
  </main>
  </section>
  `,
})
export class App implements OnInit{
  private readonly authStore  = inject(AuthStore);
  private readonly visitorsService = inject(VisitorsService);
  private readonly languageService = inject(LanguageService);

  readonly alertService = inject(AlertService);

  constructor(){
  this.authStore.getUserProfile();
  this.languageService.initSetDefaultLanguage();
  }

  ngOnInit(): void {
  this.visitorsService.createVisitors().subscribe();
  }


}
