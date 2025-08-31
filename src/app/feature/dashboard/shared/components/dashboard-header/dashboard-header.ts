import { Component } from '@angular/core';
import { SearchInputComponent } from "../../../../../shared/components/search-input/search-input.component";
import { UserProfile } from "../../../../../shared/components/user-profile/user-profile";
import { Logo } from "../../../../../shared/components/logo/logo";
import { SelectLangComponent } from "../../../../../shared/components/translation/select-lang.component";
import { SharedModule } from '../../../../../shared/modules/shared.module';

@Component({
  selector: 'app-dashboard-header',
  imports: [SharedModule , SearchInputComponent, UserProfile, Logo, SelectLangComponent],
  template: `
  <header class="size-full grid grid-cols-3 ">
    
  <form >
  <app-search-input />  
  </form>


   <div class="w-full flex justify-center items-center">
   <app-logo />
   </div>
  
  
  <aside class="flex  justify-end items-center gap-4">
  <app-select-lang />
  <a title="home" aria-label="Link Back Home" routerLink="link" routerLink="/main/home" href="/main/home"
  class="material-icons text-neutral">
  home
  </a>
  <app-user-profile />
  </aside>
  </header>
  `,
})
export class DashboardHeader {

}
