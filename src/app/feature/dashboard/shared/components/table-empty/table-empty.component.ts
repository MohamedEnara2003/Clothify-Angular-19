import { Component, input } from '@angular/core';
import { SharedModule } from '../../../../../shared/modules/shared.module';

@Component({
  selector: 'app-table-empty',
  imports: [SharedModule],
  template: `
<article class="w-full h-60 flex flex-col justify-center items-center gap-4 text-center text-base-content  ">
  <span class="material-icons  text-base-content/50" style="font-size: 2.5rem;">
    {{icon()}} 
  </span>
  <p class="text-lg font-semibold text-neutral">
    {{'tableEmpty.' + message() | translate}}
  </p>
  
  <p class="text-sm text-base-content/60">
    {{'tableEmpty.' + paragraph() | translate}}
  </p>
  

</article>
  `,

})
export class TableEmptyComponent {
  icon = input<string>('inventory_2');
  message =  input<string>('No any data!');
  paragraph =  input<string>('No any data!');
}
