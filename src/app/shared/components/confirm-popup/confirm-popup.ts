import { Component, inject } from '@angular/core';
import { ConfirmPopupService } from '../../../core/services/confirm-popup.service';
import { SharedModule } from '../../../shared/modules/shared.module';

@Component({
  selector: 'app-confirm-popup',
  imports: [SharedModule],
  template: `
  @let option = confirmPopup.confirmOption();
  @if(option !== null) { 
  <section  class="w-full h-svh  fixed top-0 left-0 flex justify-center items-center z-50 ">
  <article role="alertdialog"   aria-modal="true"
  class="w-[95%] sm:w-md h-60  bg-white flex flex-col justify-center items-center gap-10 z-50
  shadow shadow-neutral animate-up">
  <h1 class="w-full font-semibold  flex flex-wrap text-sm sm:text-base gap-2 
  items-center justify-center text-neutral text-center">
  <span class="material-icons">{{option.icon}}</span>
  {{ 'confirmPopup.' + option.message | translate }}
  </h1>
  <nav class="w-full flex justify-evenly items-center" role="navigation">
  <button (click)="confirmPopup.confirmStatus(false)" role="button" type="button"
  class="w-20 btn btn-sm uppercase btn-neutral">
  {{ 'confirmPopup.no' | translate }}
  </button>
  <button (click)="confirmPopup.confirmStatus(true)" role="button" type="button" 
  class="w-20 btn btn-sm  uppercase btn-secondary">
  {{ 'confirmPopup.yes' | translate }}
  </button>
  </nav>
  </article>

  <div aria-label="Shadow Overlay"  (click)="confirmPopup.confirmStatus(false)"
  class="w-full h-full fixed top-0 left-0 bg-neutral/50 z-40 cursor-pointer"> 
  </div>
  </section>
}
  `,
})
export class ConfirmPopup {
  readonly confirmPopup = inject(ConfirmPopupService);

}
