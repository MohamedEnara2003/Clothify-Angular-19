import { Component, computed, inject, model } from '@angular/core';
import { DashboardService } from '../../../dashboard.service';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { AuthStore } from '../../../../../store/auth/auth.signal';

@Component({
  selector: 'app-dashboard-aside',
  imports: [SharedModule],
  template: `
  <aside aria-label="Dashboard Aside" class="size-full bg-neutral grid grid-cols-1
  duration-300 transition-all  p-2 shadow-lg">


  <section class="w-full h-full flex flex-col justify-between items-center py-4"> 

  <header class=" w-full flex flex-wrap justify-between items-center p-2 gap-2" role="heading" >

  <button  type="button" role="button" aria-label="Button initialize dashboard aside" 
  class="material-icons  btn btn-square btn-sm"
  (click)="isLoad.set(!isLoad())">
    menu
  </button>

    <h1 class="text-xl  sm:text-2xl font-bold text-secondary animate-up"  [ngClass]="isLoad() ? 'hidden' : ''">
      {{'navigation.Dashboard' | translate}}
    </h1>
  </header>

    <nav class="w-full" role="navigation">
      <ul aria-label="Dashboard Menu Links" role="menu" class="grid grid-cols-1 w-full gap-2 text-base sm:text-lg">

        @for (link of dashboardLinks(); track link.path) {
          <li [title]="link.name | translate"
          aria-label="Dashboard Menu Items" role="menuitem">
            <a 
              [routerLink]="link.path" 
              routerLinkActive="bg-secondary text-secondary-content shadow-md"
              [routerLinkActiveOptions]="{exact : false}"
              class="flex p-2 items-center gap-3 hover:bg-secondary  transition-colors 
              duration-300 text-neutral-content "
            [ngClass]="isLoad() ? 'justify-center' : ''">
            <span class="material-icons text-lg">{{ link.icon }}</span>
            @defer (when !isLoad()) {
              <span aria-hidden="true" class="font-medium"
              [ngClass]="isLoad() ? 'hidden' : ''">{{ link.name | translate}}
            </span>
            }
            </a>
          </li>
        }
        
      </ul>
    </nav>
  </section>

  <nav class="w-full mt-5" role="navigation">
    <ul aria-label="Admin Profile" role="menu" class="menu menu-lg rounded-box w-full">
      <li aria-label="Admin Profile Item" role="menuitem">

      <p class="w-full flex items-start  flex-col p-2 gap-1  transition-colors  
      duration-200 text-neutral-content border-t border-neutral-content/20"
      [ngClass]="isLoad() ? 'hidden' : ''">
      <span class="font-bold text-secondary">
      {{'role.' + authStore.user()?.role  | translate}}
      </span>
      <span class="text-sm opacity-70 capitalize">{{authStore.user()?.fullName}}</span>
      </p>

      </li>
    </ul>
  </nav>

  </aside>
  `,
})
export class DashboardAside {
  readonly dashboardService = inject(DashboardService);
  readonly authStore = inject(AuthStore);
  dashboardLinks = computed(() => this.dashboardService.dashboardSideLinks()
  .filter((link) => this.authStore.user()?.role === 'SuperAdmin' ? link : link.id !== 6) 
  );
  isLoad = model<boolean>(false);

}