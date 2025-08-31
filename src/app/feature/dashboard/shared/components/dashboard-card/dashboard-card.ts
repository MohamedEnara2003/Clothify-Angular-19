import { Component, input } from '@angular/core';
import { SharedModule } from '../../../../../shared/modules/shared.module';

@Component({
  selector: 'app-dashboard-card',
  imports: [SharedModule],
  template: `
<section 
  aria-label="Dashboard Statistics Section" 
  role="region" 
  class="w-full grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-2">

  @for (item of cardItems(); track item) {
    <article
      role="article"
      [attr.aria-labelledby]="'card-title-' + item.title"
      [attr.aria-describedby]="'card-description-' + item.title"
      class="w-full h-15 rounded-lg bg-neutral-content shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral/20 animate-down"
      [attr.data-testid]="'dashboard-card-' + item.title">

      @defer (on viewport) {
        <header class="flex justify-between items-center p-2">
          
          <section>
            <h2 
              class="text-sm text-neutral/70" 
              [id]="'card-title-' + item.title">
              {{ item.title | translate }}
            </h2>

            <p 
              class="text-neutral font-bold" 
              [id]="'card-description-' + item.title" 
              role="text"
              [attr.aria-label]="item.title + ' count ' + item.count">
              {{ item.count | number:'1.0-0' }}
            </p>
          </section>

          <aside 
            class="size-8 rounded flex justify-center items-center bg-secondary text-secondary-content shadow" 
            aria-hidden="true">
            <span class="material-icons" >{{ item.icon }}</span>
          </aside>

        </header>
      }
      @placeholder {
        <div class="size-full bg-neutral-300 animate-pulse"></div>
      }
    </article>
  }
</section>

  `,
})
export class DashboardCard {
  cardItems = input<Array<{
  title : string ,
  icon : string ,
  count : number ,
  }>>();

}
