import { Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';
import { ConfirmPopupService } from '../../../../../core/services/confirm-popup.service';
import { AuthStore } from '../../../../../store/auth/auth.signal';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { NavCheckLinksComponent } from "../../../shared/components/nav-check-links/nav-check-links.component";
import { TableEmptyComponent } from "../../../shared/components/table-empty/table-empty.component";
import { CheckDataService } from '../../../../../core/services/check-data.service';
import { CheckAllComponent } from "../../../shared/components/check-all/check-all.component";


@Component({
  selector: 'app-users',
  imports: [SharedModule, NavCheckLinksComponent, TableEmptyComponent, CheckAllComponent],
  template: `
    <section class="w-full h-[90svh] flex flex-col item-start py-4 gap-4 " aria-label="User Management Page">
      
        <h1 aria-label="Title User Management Page" 
        class="w-full text-center text-lg xs:text-2xl sm:text-3xl font-bold text-neutral"> 
          {{'dashboard.User Management' | translate}}
        </h1>

<section class="w-full grid grid-cols-1 gap-2">

<header class="w-full flex justify-between items-center p-1  z-10">
<app-nav-check-links (confirm)="confirm()" />
</header>


<div class="overflow-auto max-h-[500px] border border-base-300 rounded-md">
  <table class="table table-xs xs:table-sm md:table-md w-full">

    <thead class="bg-neutral-content sticky top-0 z-10">
      <tr>
        <th>
        <app-check-all  [isDisabled]="authStore.user()?.role !== 'SuperAdmin'"/>
        </th>
        @for (item of tableColumns(); track item) {
          <th>{{ 'dashboard.' + item | translate }}</th>
        }
      </tr>
    </thead>

    <tbody>
      @for (user of authStore.users() ; track user.id) {
        <tr>
          <th>
            <label>
              <input type="checkbox" class="checkbox checkbox-neutral"
                (change)="checkDataService.onCheckData(user.id)"
                [checked]="checkDataService.valueIds().includes(user.id)" 
                [title]="authStore.user()?.role === 'SuperAdmin' ? 
                '' :
                authStore.user()?.role  + ' role not allowed'" 
                [disabled]="user.id === authStore.user()?.id || authStore.user()?.role !== 'SuperAdmin'"
                /> 
            </label>
          </th>

          <td>{{ user.id }}</td>
          <td>{{ user.fullName }}</td>
          <td>{{ user.email }}</td>

          <td>
            <div class="w-20 sm:w-25 badge badge-xs sm:badge-sm text-center "
              [ngClass]="user.role === 'Admin' ? 'badge-neutral' : 'badge-secondary'">
              {{ 'role.' + user.role | translate }}
            </div>
          </td>

          <td>
              <p class="badge badge-xs md:badge-sm text-center"
              [ngClass]="user.isActive ? 'badge-success' : 'badge-error'">
              {{(user.isActive ? 'dashboard.Active' : 'dashboard.Inactive') | translate}}
              </p>
          </td>
        </tr>
      }@empty {
 
        <tr>
          <th [attr.colspan]="tableColumns().length + 1" class="text-center py-10">
            <app-table-empty 
            icon="group"
            message="messageUsersEmpty"
            paragraph="paragraphUsersEmpty"
            />
          </th>
        </tr>
     
      }
    </tbody>
  </table>
</div>
</section>

</section>
    
  `,  
  providers : [CheckDataService],

})
export class Users  implements OnDestroy{
  private readonly confirmPopupService = inject(ConfirmPopupService);
  readonly authStore = inject(AuthStore);

  readonly checkDataService = inject(CheckDataService);

  tableColumns = signal<string[]>(['ID', 'Full Name', 'Email', 'Role', 'Status']).asReadonly();
  
  userIds = computed<string[]>(() => this.authStore.users().map(u => u.id));

  constructor(){
  effect(() => this.checkDataService.initAllDataIds(this.userIds()))
  this.authStore.getAllUsers();
  }


  confirm() : void {
   const userIds = this.checkDataService.valueIds();
    this.confirmPopupService.confirm({
      message : this.checkDataService.isCheckAllData()  ? 'delAllUsersMsg' : 'delUsersMsg',
      icon : 'help' ,
      accept : () => {
      this.authStore.deleteUsers(userIds);
      this.checkDataService.clearAllChecks();
      },
      reject : () => this.checkDataService.clearAllChecks(),
    })
  }

  ngOnDestroy(): void {
  this.checkDataService.clearAllChecks();
  }
  
}
