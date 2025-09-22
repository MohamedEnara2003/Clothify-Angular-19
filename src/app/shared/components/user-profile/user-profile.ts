import { Component, computed, inject, signal } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { AuthStore } from '../../../store/auth/auth.signal';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/translations/language.service';
import { AppLinksService } from '../../../core/services/app-links.service';


@Component({
  selector: 'app-user-profile',
  imports: [SharedModule, TranslateModule],
  template: `
  <section class="flex flex-col gap-1 relative">
  
  <button (click)="isProfile.set(!isProfile())" type="button" role="button" aria-label="Button User Profile" 
  class="text-secondary-content rounded-full size-6 
  uppercase cursor-pointer bg-secondary hover:text-secondary-content  duration-200 transition-colors
  flex justify-center items-center">
  @if(user()?.id){
  <span class="text-sm font-bold">{{user()?.fullName?.slice(0 , 1)}}</span>
  }@else {
  <span class="material-icons">account_circle</span>
  }
  </button>

  @if(isProfile()){

  <nav aria-label="User Profile" role="navigation" 
  class="absolute top-12  w-60 bg-white shadow-lg border border-neutral-content rounded 
  p-4 z-40"
  [ngClass]="languageService.currentLanguage() === 'en' ? 'animate-sideRight right-0' : 'animate-sideLeft left-0'">
  <ul aria-label="List of User Profile" role="list" class="flex flex-col gap-2">
  
  @if(user()?.id){
  
  @if(isDashboard()) {
  <li  aria-label="Item User Profile" role="listitem">
  <a routerLink="/dashboard"  role="link"  (click)="isProfile.set(false)"
  routerLinkActive="text-secondary"
  class="flex items-center gap-2 link link-neutral hover:text-secondary link-hover 
  duration-300 transition-colors">
  <span class="material-icons-outlined" style="font-size: 1.5rem;">dashboard</span>
  <span class="text-sm">{{'navigation.Dashboard' | translate}}</span>
  </a>
  </li> 
  }

  @for (link of profileLinks(); track link) {
  <li [attr.aria-label]="'List ' + link.name + 'User Profile'" role="listitem">
  <a [routerLink]="link.path" [attr.aria-label]="'Link ' + link.name + 'User Profile'" role="link" 
  routerLinkActive="text-secondary" (click)="isProfile.set(false)"
  class="flex items-center gap-2 link link-neutral hover:text-secondary link-hover 
  duration-300 transition-all">
  <span class="material-icons-outlined" style="font-size: 1.5rem;">{{link.icon}}</span>
  <span class="text-sm">{{'navigation.' + link.name | translate}}</span>
  </a>
  </li>
  }

  <li aria-label="List log out user profile"  role="listitem">
  <a role="link" aria-label="Link log out user profile"  (click)="isProfile.set(false)"
  class="flex items-center gap-2 link link-neutral hover:text-secondary link-hover 
  duration-300 transition-colors">
  <span class="material-icons-outlined" style="font-size: 1.5rem;">logout</span>
  <span class="text-sm">log out</span>
  </a>
  </li> 
  }
  @else {
  <li aria-label="Item User Profile" role="listitem">
  <a [routerLink]="'/auth/register'"   aria-label="Register Link" role="link" 
  class="flex items-center gap-2 link link-neutral hover:text-secondary link-hover 
  duration-300 transition-colors"
  routerLinkActive="text-secondary" (click)="isProfile.set(false)">
  <span class="material-icons-outlined" style="font-size: 1.5rem;">person_add</span>
  <span class="text-sm">{{ 'links.register' | translate }}</span>
  </a>
  </li>
  <li aria-label="Item User Profile" role="listitem">
  <a [routerLink]="'/auth/login'" aria-label="Login Link" role="link" 
  class="flex items-center gap-2 link link-neutral hover:text-secondary link-hover 
  duration-200 transition-colors"
  routerLinkActive="text-secondary">
  <span class="material-icons-outlined" style="font-size: 1.5rem;">login</span>
  <span class="text-sm">{{ 'links.login' | translate }}</span>
  </a>
  </li>
  }
  </ul>
  </nav>
  }

  </section>
  `,
})
export class UserProfile {
  private readonly authStore  = inject(AuthStore);
  private readonly appLinksService = inject(AppLinksService);
  readonly languageService = inject(LanguageService);


  isProfile = signal<boolean>(false);
  
  isDashboard = computed<boolean>(() => {
  const user = this.authStore.user() 
  if(user){
  const {role} = user;
  return  role === 'SuperAdmin' || role === 'Admin' || role === 'Moderator'
  }
  return false
  });

  user = computed(() => this.authStore.user());
  profileLinks = computed(() => this.appLinksService.profileLinks());



}
