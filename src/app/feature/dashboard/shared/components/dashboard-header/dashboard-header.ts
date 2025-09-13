import { Component } from '@angular/core';
import { UserProfile } from "../../../../../shared/components/user-profile/user-profile";
import { Logo } from "../../../../../shared/components/logo/logo";
import { SelectLangComponent } from "../../../../../shared/components/translation/select-lang.component";
import { SharedModule } from '../../../../../shared/modules/shared.module';

@Component({
  selector: 'app-dashboard-header',
  imports: [SharedModule , UserProfile, Logo, SelectLangComponent],
  template: `
  <header class="size-full grid grid-cols-2   ">
    
  <app-logo />

  

  <aside class="flex  justify-end items-center gap-4">
  <app-select-lang />
  <app-user-profile />
  </aside>
  </header>
  `,
})
export class DashboardHeader {

}
