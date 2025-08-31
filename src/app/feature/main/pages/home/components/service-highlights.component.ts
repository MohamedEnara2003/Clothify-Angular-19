import { Component, signal } from '@angular/core';
import { SharedModule } from '../../../../../shared/modules/shared.module';

@Component({
  selector: 'app-service-highlights',
  imports: [SharedModule],
  template: `
  @defer (on viewport) {
      <section aria-label="Service Highlights" role="region" class="w-full py-4">
      <ul role="list" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-neutral">
        @for (item of serviceHighlights(); track item.title) {
          <li role="listitem" class="flex flex-col items-center justify-center  bg-neutral-50 rounded-lg 
          shadow p-2 h-full text-center transition-colors duration-300 animate-up   ">
            <span class="material-icons text-3xl md:text-4xl" aria-hidden="true"
            style="font-size: xx-large;">
              {{ item.icon }}
            </span>
            <span class="text-base md:text-lg font-semibold " role="text">
              {{ 'serviceHighlights.' + item.title | translate }}
            </span>
          </li>
        }
      </ul>
    </section>
  }@placeholder {
  <div class="w-full py-4 bg-neutral-300 animate-pulse"></div>
  }
  `,
})
export class ServiceHighlightsComponent {
  serviceHighlights = signal([
    { title: 'Cash on Delivery', icon: 'local_shipping' },
    { title: 'Free Shipping over 1399 EGP', icon: 'local_mall' },
    { title: '14 Days Return', icon: 'autorenew' },
    { title: 'Call Center 16579', icon: 'support_agent' },
  ]).asReadonly();
}
