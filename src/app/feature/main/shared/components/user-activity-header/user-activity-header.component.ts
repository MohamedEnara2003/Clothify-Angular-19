import { Component, input } from '@angular/core';

@Component({
  selector: 'app-user-activity-header',
  imports: [],
  template: `
  <header [attr.aria-label]="title() + ' Header User Activity'" role="header" 
  class="w-full flex py-4">
  <h1 class="text-neutral text-lg sm:text-xl font-semibold">{{title()}} ({{count()}})</h1>
  </header>
  `,
})
export class UserActivityHeaderComponent {
  title = input.required<string>();
  count = input.required<number>();
}
