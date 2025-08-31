import { Component , input } from '@angular/core';

import { DashboardCard } from "../../../shared/components/dashboard-card/dashboard-card";

@Component({
  selector: 'app-analytics-header',
  imports: [ DashboardCard],
  template: `
  <header aria-label="Analytics Header"  role="heading"
  class="w-full flex flex-col  justify-center items-center gap-4">
  <app-dashboard-card [cardItems]="dashboardCards()"  class="w-full"/>
  </header>
  `,

})
export class AnalyticsHeaderComponent {
  dashboardCards = input.required<Array<{title : string , icon : string , count : number}>>()
  


}
