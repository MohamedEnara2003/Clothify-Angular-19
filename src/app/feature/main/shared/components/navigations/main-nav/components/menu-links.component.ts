import { Component, input, model } from '@angular/core';
import { SharedModule } from '../../../../../../../shared/modules/shared.module';

@Component({
  selector: 'app-menu-links',
  imports: [SharedModule],
  template: `
  <nav class="flex flex-col   items-center gap-10 p-4
  z-30 size-full bg-white animate-sideLeft">

      <ul 
      class="w-full flex flex-col  justify-center items-center gap-5 text-lg text-neutral font-bold capitalize"
      role="menu">
      @for (item of items(); track item) {
      <li class="w-full relative" role="none">
        <a  (click)="selectItem.set(item)"
        class="w-full hover:text-secondary 
        flex justify-between items-center gap-2"
        role="menuitem"
        [attr.aria-haspopup]="true" >
        {{item | translate}}
      <span class="material-icons-outlined" style="font-size: 1.2rem;">east</span>
      </a>
    </li>
    }
    <ng-content />
    </ul>
  </nav>
  `,
})
export class MenuLinksComponent {
  items = input<string[]>([]);
  selectItem = model<string>();
}
