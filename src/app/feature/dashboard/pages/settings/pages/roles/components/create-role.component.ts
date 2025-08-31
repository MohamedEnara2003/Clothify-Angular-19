import { Component, model, OnInit, output } from '@angular/core';
import { Role } from '../../../../../../../core/interfaces/user.interface';
import { SharedModule } from '../../../../../../../shared/modules/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainFields } from "../../../../../../auth/shared/components/main-fields/main-fields";
import { RoleDataType } from '../service/role.service';

@Component({
  selector: 'app-create-role',
  imports: [SharedModule, MainFields],
  template: `
    <section  aria-label="Section Create Role Form" role="region"
    class="w-full h-svh fixed top-0 left-0 flex justify-center items-center z-50">
    
    <form [formGroup]="form" role="form"  aria-label="Create Role Form"
    class="relative w-full sm:w-2xl h-[90%] bg-white rounded shadow shadow-neutral z-50
    grid grid-cols-1 p-4  animate-up" (ngSubmit)="onSubmit()" >

    <button type="button" role="button" aria-label="Button Close Model Create Role"
    class="material-icons btn btn-circle btn-sm"
    (click)="isLoadModelCreateRole.set(false)">
    close
    </button>

    <app-main-fields [formGroup]="form"  class="w-full flex justify-center  " >
    <legend id="form-legend" class="w-full fieldset-legend  text-xl  sm:text-2xl 
    flex flex-col justify-center items-center">
    {{ 'dashboard.Create Role' | translate }}
    </legend>

    <ng-container selectRole>
    <label for="selectRole" class="label" [attr.aria-label]="'auth.selectRole' | translate">
      {{ 'auth.Role' | translate }}
    </label>

    <select name="selectRole" id="selectRole" class="select w-full bg-white"
      [ngClass]="shouldShowValidation('role') ? 'select-error' : 'select-secondary'"
      formControlName="role"
      aria-describedby="role-error"
      aria-required="true"
      autocomplete="name">
      @for (role of roles; track role) {
      <option [value]="role">{{'role.' + role | translate}}</option>
      }
    </select>

    @if (shouldShowValidation('role') ) {
    <p id="role-error" class="text-error text-xs">
    {{'auth.' + getErrorMessage('role') | translate}}
    </p>
    }
    
    <label for="sentEmail" class="label" [attr.aria-label]="'auth.sentEmail' | translate">
      {{ 'auth.sentEmail' | translate }}
    </label>

    <input type="email" id="sentEmail" class="input input-bordered w-full bg-white"
      [ngClass]="shouldShowValidation('sentEmail') ? 'input-error' : 'input-secondary'"
      formControlName="sentEmail"
      aria-describedby="sentEmail-error"
      aria-required="true"
      autocomplete="sentEmail" />

    @if (shouldShowValidation('sentEmail') ) {
    <p id="sentEmail-error" class="text-error text-xs">
    {{'auth.' + getErrorMessage('sentEmail') | translate}}
    </p>
    }
    
  </ng-container>

  <button 
    formBtn 
    type="submit"
    class="btn btn-neutral mt-4" 
    [title]="'dashboard.Create Role' | translate"
    [attr.aria-label]="'dashboard.Create Role' | translate"
    role="button"
  >
  
  {{'dashboard.Create Role' | translate }}
  </button>
  </app-main-fields>
  </form>
  
  <div class="size-full bg-neutral/50 z-40 fixed top-0 left-0 "
  (click)="isLoadModelCreateRole.set(false)">
  </div>
  </section>
  `,


})
export class CreateRoleComponent implements OnInit{
  isLoadModelCreateRole = model<boolean>(false)
  createRole = output<RoleDataType>();

  roles : Role[] = ['Moderator' , 'Admin' , 'SuperAdmin'];

  form!: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
  const emailValidator = [Validators.required, Validators.email , Validators.maxLength(254)]
    this.form = this.fb.group({
      email: ['', emailValidator],
      password: ['', [Validators.required, Validators.minLength(8) , Validators.maxLength(80)]],
      role : ['',  [Validators.required]],
      sentEmail : ['',  emailValidator]
    });
  }

  shouldShowValidation(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control ? (control.invalid && (control.touched)) : false;
  }

  getErrorMessage(controlName: string) : string {
  const control = this.form.get(controlName);
  if (!control || !control.errors) return '';
  if(control.errors['required']) return `${controlName} is required`;
  if(control.errors['email']) return `${controlName} is not valid`;
  if(control.errors['minlength']) return `${controlName} is not valid`;
  if(control.errors['maxLength']) return `${controlName} is not valid`;
  return ''
  }

  onSubmit() {
  if (this.form.valid) {
  const roleData: RoleDataType = this.form.getRawValue() as RoleDataType;
  this.createRole.emit(roleData);
  return
  } 

  this.form.markAllAsTouched();
    
  }

}
