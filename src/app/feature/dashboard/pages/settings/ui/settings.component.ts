import { Component, computed, inject, signal } from '@angular/core';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { ActivatedRoute } from '@angular/router';
import { NavListItemsComponent } from "../../../../main/shared/components/navigations/nav-list-items/nav-list-items.component";
import { Links } from '../../../../main/shared/interfaces/links.interface';

@Component({
  selector: 'app-settings',
  imports: [SharedModule, NavListItemsComponent],
  template: `
  <section  aria-label="Settings Page" role="region"
  class="w-full h-[90svh] bg-white flex flex-col gap-2 overflow-y-auto">

  <header aria-label="Settings Header Links" role="heading" class="w-full flex justify-center ">
  <app-nav-list-items [items]="settingsLinks()" [isHomeLink]="false" />
  </header>

  <header aria-label="Settings Title" role="heading"  class="w-full">
    <h1 aria-label="Title Product Management Page" 
    class="w-full text-center text-lg xs:text-2xl sm:text-3xl font-bold text-neutral capitalize"> 
    {{'dashboard.Setting' | translate}}  /
    {{'dashboard.' + firstChildPath() | translate}}
    </h1>
  </header> 

  <main aria-label="Settings Main Content" role="main" >
  <router-outlet />
  </main>

  </section>
  `,
})
export class SettingsComponent {
  private readonly activatedRoute = inject(ActivatedRoute);

  settingsLinks = signal<Links[]>([ 
  {name: 'dashboard.Store' ,  icon : 'store' , path : '/dashboard/settings/store'},
  {name: 'dashboard.roles' ,  icon : 'admin_panel_settings' , path : '/dashboard/settings/roles'},
  {name: 'cart.Shipping', icon : 'local_shipping' ,  path : '/dashboard/settings/shipping'},
  ]).asReadonly(); 

  firstChildPath = computed<string>(() => {
  const child = this.activatedRoute.firstChild;
  return child?.snapshot.routeConfig?.path ?? '';
  });

}
