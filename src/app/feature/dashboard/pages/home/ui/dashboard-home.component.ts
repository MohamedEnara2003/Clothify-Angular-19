import { Component, inject } from '@angular/core';
import { AuthStore } from '../../../../../store/auth/auth.signal';

@Component({
  selector: 'app-dashboard-home',
  imports: [],
  template: `

<section 
  class="p-6 bg-base-200 rounded-xl shadow-md space-y-4" 
  role="region" 
  aria-label="Dashboard Home Section"
  aria-labelledby="dashboard-welcome"
>
  <header class="w-full flex justify-center">
    <h1 
      id="dashboard-welcome" 
      class="text-xl sm:text-2xl md:text-3xl font-bold capitalize"
    >
      Welcome back, <span class="text-secondary ">{{user?.fullName|| 'user'}} </span> in dashboard 👋 
    </h1>
  </header>


</section>

  `,
})
export class DashboardHomeComponent {
  readonly user = inject(AuthStore).user();
}
