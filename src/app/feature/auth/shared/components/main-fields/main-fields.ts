import { Component, input, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { FormControlComponent } from "../../../../../shared/components/form-control/form-control.component";


@Component({
  selector: 'app-main-fields',
  imports: [SharedModule, FormControlComponent],
  template: `

  <fieldset [formGroup]="formGroup()" 
  class="w-full fieldset bg-white border-base-300 rounded-box  border  space-y-1 px-4" role="group" 
  aria-labelledby="form-legend">

  <ng-content />

@let Email = "email" ;
<app-form-control 
[option]="{
type : Email,
name : Email,
formControlName : Email,
label : 'auth.Email',
id : Email,
autocomplete : Email,
inputmode : Email,
isRequired : true
}"
[form]="formGroup()" />

@let Password = "password" ;
<app-form-control 
[option]="{
type : inVisible() ? 'text' : 'password',
name : Password,
formControlName : Password,
label : 'auth.Password',
id : Password,
autocomplete : 'current-password',
icon :  inVisible() ? 'visibility' : 'visibility_off' ,
isRequired : true
}"
[form]="formGroup()" 
(onClickIcon)="inVisible.set(!inVisible())"
/>
  <ng-content select="[selectRole]"/>
  <ng-content select="[formBtn]" />
</fieldset>

  `,
})
export class MainFields {
  formGroup = input.required<FormGroup>();
  inVisible = signal<boolean>(false);
}
