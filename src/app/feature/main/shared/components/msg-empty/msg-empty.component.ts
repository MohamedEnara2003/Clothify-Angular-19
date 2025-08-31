import { Component, input } from '@angular/core';
import { SharedModule } from '../../../../../shared/modules/shared.module';

@Component({
  selector: 'app-msg-empty',
  imports: [SharedModule],
  template: `
  <section aria-label="Section Message Empty" role="section" 
  class="w-full h-80 flex flex-col justify-center items-center gap-7">
  <h1 class="text-3xl font-semibold text-neutral text-center">{{msg() | translate}}</h1>
  <a title="Shop Now" routerLink="/main/collections" href="/main/collections"  role="link" 
  class="btn btn-neutral w-60">{{'main.Shop Now' | translate}}</a>
  </section>
  `,
})
export class MsgEmptyComponent {
  msg = input.required<string>();
}
