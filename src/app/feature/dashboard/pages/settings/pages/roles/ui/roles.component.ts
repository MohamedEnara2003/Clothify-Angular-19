import { Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';
import { SharedModule } from '../../../../../../../shared/modules/shared.module';
import { TableEmptyComponent } from "../../../../../shared/components/table-empty/table-empty.component";
import { LoadingSpinner } from "../../../../../../main/shared/components/loading/loading-spinner";
import { CreateRoleComponent } from "../components/create-role.component";
import { RoleDataType, RoleService } from '../service/role.service';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavCheckLinksComponent } from "../../../../../shared/components/nav-check-links/nav-check-links.component";
import { ConfirmPopupService } from '../../../../../../../core/services/confirm-popup.service';
import { CheckDataService } from '../../../../../../../core/services/check-data.service';
import { CheckAllComponent } from "../../../../../shared/components/check-all/check-all.component";


@Component({
  selector: 'app-roles',
  imports: [
  SharedModule, 
  TableEmptyComponent, 
  LoadingSpinner, 
  CreateRoleComponent, 
  NavCheckLinksComponent, 
  CheckAllComponent],
  template: `
  <section aria-label="Roles Management" role="region" class="flex flex-col gap-4 mt-2">

  <header class="w-full flex justify-between items-center   z-10">
  <button  type="button"  role="button" aria-label="Button Create Product"
  class="btn btn-md btn-secondary uppercase"
  (click)="isLoadModelCreateRole.set(true)">
  <span class="material-icons">admin_panel_settings</span>
  {{'dashboard.Create Role' | translate}}
  </button>

<app-nav-check-links (confirm)="confirmDeleteRoles()" />
</header>


<div class="w-full overflow-auto max-h-[360px] border border-base-300 rounded-md">
  <table class="table table-xs xs:table-sm md:table-md w-full">
    @defer (when isLoading() ) {
    <thead class="bg-neutral-content sticky top-0 z-10">
      <tr>
        <th class="flex items-center gap-5">
        <app-check-all />
        </th>
        @for (item of tableColumns(); track item) {
        <th>{{ item  | translate}}</th>
        }
      </tr>
    </thead>

    <tbody>
      @for (user of usersRolesData() ; let i = $index; track user) {
        @defer (on viewport) {
        <tr>
          <th class="flex items-center gap-5">

            <input [title]="'Check Role ' + (i + 1)" 
            type="checkbox" role="checkbox" class="checkbox checkbox-neutral"
            [checked]="checkDataService.valueIds().includes(user.id || '')"
            (change)="checkDataService.onCheckData(user.id || '')"
            />

            <button
              [title]="('dashboard.Copy' | translate) + ' ' + (i + 1)"
              type="button"
              class="material-icons text-secondary btn btn-sm btn-circle"
              [attr.aria-label]="('dashboard.Copy' | translate) + ' ' + (i + 1)" 
            
              >
              copy
            </button>
          </th>

          <td>{{ user.id }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>

      
        </tr>
      }@placeholder {
        <tr class="text-center ">
        <th  [attr.colspan]="tableColumns().length + 1">
        <div class="w-full h-15 bg-neutral-300 animate-pulse"></div>
        </th>
        </tr>
        }
      }@empty {
        <tr>
          <th [attr.colspan]="tableColumns().length + 1" class="text-center py-10">
            <app-table-empty 
            icon="admin_panel_settings"
            message="messageRolesEmpty"
            paragraph="paragraphRolesEmpty"
            />
          </th>
        </tr>
      }
    </tbody>

  }@placeholder {
  <section class="w-full h-[350px] bg-white flex justify-center items-center">
  <app-loading-spinner />
  </section>
  }
  </table>
</div>

  @if (isLoadModelCreateRole()) {
    <app-create-role
    [isLoadModelCreateRole]="isLoadModelCreateRole()"
    (isLoadModelCreateRoleChange)="isLoadModelCreateRole.set($event)"
    (createRole)="createRole($event)" 
    /> 
  }

  </section>
  `,
  providers : [RoleService ]
})

export class RolesComponent implements OnDestroy {
  private readonly roleService = inject(RoleService);
  private readonly confirmPopupService = inject(ConfirmPopupService);
  readonly checkDataService = inject(CheckDataService);

  usersRolesData = signal<RoleDataType[]>([]);
  isLoading = signal<boolean>(false);
  isLoadModelCreateRole = signal(false);

  tableColumns = signal<string[]>([
  'dashboard.ID' , 'dashboard.Email' ,'dashboard.Role'
  ]);

  rolesIds = computed<string[]>(() =>
  this.usersRolesData().map(({id}) => id || '')
  );
  

  constructor() {
  effect(() => this.checkDataService.initAllDataIds(this.rolesIds()))
  this.getRoles();
  }


  private getRoles() {
  this.isLoading.set(true);
  this.roleService.getRoles().pipe(
  tap(({data}) => {
  if(data){
  const {roles} = data;
  this.usersRolesData.set(roles);
  }
  
  this.isLoading.set(false);
  }),
  takeUntilDestroyed()
  ).subscribe();
  }
  
  createRole(roleData: RoleDataType) {
    this.roleService.createRole(roleData).pipe(
    tap(({role}) => this.usersRolesData.update(roles => [...roles, role])),
    ).subscribe();
    this.isLoadModelCreateRole.set(false);
  }

  confirmDeleteRoles() : void{
  const rolesIds = this.checkDataService.valueIds();
    this.confirmPopupService.confirm({
      message: this.checkDataService.isCheckAllData() ? 'delAllRolesMsg' : 'delRolesMsg',
      icon: 'help',
      accept: () => {
        if (rolesIds.length > 0) {
        this.roleService.deleteRole(rolesIds).pipe(
        tap(() => {
        this.usersRolesData.update(roles => roles.filter(role => !rolesIds.includes(role.id || '')))
        }),
        ).subscribe();
        }
        
      this.checkDataService.clearAllChecks();
      },
      reject: () => this.checkDataService.clearAllChecks(),
    });
  }

  ngOnDestroy(): void {
  this.checkDataService.clearAllChecks();
  }
  
}
