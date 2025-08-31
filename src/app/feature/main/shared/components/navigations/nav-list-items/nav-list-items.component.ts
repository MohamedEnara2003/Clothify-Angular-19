import { Component, input } from '@angular/core';
import { Links } from '../../../interfaces/links.interface';
import { SharedModule } from '../../../../../../shared/modules/shared.module';

@Component({
  selector: 'app-nav-list-items',
  imports: [SharedModule],
  template: `
  <nav aria-label="Navigation List" role="navigation" class="w-full py-2 text-neutral text-xs sm:text-sm">
    <ul aria-label="Navigation List Items" role="list" 
    class="flex flex-wrap  gap-4">
      @if(isHomeLink()){
      <li aria-label="Home Link" role="listitem">
        <a routerLink="/main/home" class="flex items-center gap-1">
        <span class="material-icons">home</span>
          <span>{{'navigation.Home' | translate}}</span>
        </a>
      </li>
      }
      @if(items().length > 0){
      @for(item of items(); let i =  $index; let count = $count ; track item){
        <li [attr.aria-label]="item.name" role="listitem" class="flex items-center gap-1">
          <a title="{{item.name | translate}}"
          [routerLink]="item.path" [href]="item.path" [attr.aria-label]="item.name" role="link"
          routerLinkActive="text-secondary"
          [queryParams]="item.queryParams"
          class="flex items-center gap-1 hover:text-secondary hover:scale-105 transition-all duration-300">
            <span class="material-icons-outlined">{{item.icon}}</span>
            <span class="capitalize">{{item.name | translate}}</span>
          </a>
          
          @if( (i + 1) !== count){
          <span class="material-icons text-neutral/50" style="font-size: 1rem;">horizontal_rule</span>
          }
      

        </li>
      }
      }
    </ul>
  </nav>
  `,
})
export class NavListItemsComponent {
  isHomeLink = input<boolean>(true);
  items = input<Links[]>([]);
}
