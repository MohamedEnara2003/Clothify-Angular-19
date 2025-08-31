import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { MainFields } from "../../shared/components/main-fields/main-fields";
import { SharedModule } from '../../../../shared/modules/shared.module';
import { authData } from '../../../../core/interfaces/user.interface';
import { AuthStore } from '../../../../store/auth/auth.signal';
import { TranslateModule } from '@ngx-translate/core';
import { FormControlComponent } from "../../../../shared/components/form-control/form-control.component";

@Component({
  selector: 'app-register',
  imports: [MainFields, SharedModule, TranslateModule, FormControlComponent],
  template: `
  <section aria-label="Register Page" role="region"
  class="size-full flex justify-center items-center bg-white  py-2 rounded shadow">
    
  <form [formGroup]="registerForm" (ngSubmit)="onRegisterSubmit()" role="form" 
  aria-label="Authentication Form" class="w-xs xs:w-sm sm:w-2xl md:w-lg xl:w-2xl 2xl:w-3xl">

    <app-main-fields [formGroup]="registerForm" 
    class="w-full flex justify-center items-center">

  <legend id="form-legend" class="w-full fieldset-legend  text-xl  sm:text-2xl 
  flex flex-col justify-center items-center">
  {{ 'auth.createAccount' | translate }}
  @if(authStore.registerErrorMsg()){
  <p class="text-error text-sm animate-up">{{authStore.registerErrorMsg()}}</p>
  }
  </legend> 

@let FullName = "fullName" ;
<app-form-control
[option]="{
type : 'text',
name : FullName,
formControlName : FullName,
label : 'auth.fullName',
id : FullName,
autocomplete : 'username',
isRequired : true
}"
[form]="registerForm" 
/>

  <button 
    formBtn 
    type="submit"
    class="btn btn-neutral mt-4" 
    [attr.aria-label]="'auth.submitRegistration' | translate"
    role="button"
  >

  {{'auth.register' | translate }}
  </button>
  </app-main-fields>



  <nav class="flex justify-center items-center gap-1" role="navigation">
  <p >{{ 'auth.alreadyHaveAccount' | translate }}</p>
  <a  routerLink="/auth/login" href="/auth/login"  aria-label="Login Page Link" 
  class="link link-secondary">{{ 'auth.login' | translate }}</a>
  </nav>
   
  </form>

  </section>
  `,
})
export class Register implements OnInit , OnDestroy {
  private readonly fb = inject(NonNullableFormBuilder);
  readonly authStore = inject(AuthStore);

  public registerForm!: FormGroup;


  ngOnInit() {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2) , Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email , Validators.maxLength(254)]],
      password: ['', [Validators.required, Validators.minLength(8) , Validators.maxLength(80)]],
    });
  }

  onRegisterSubmit() {
    if(this.registerForm.valid){
    const user : authData = this.registerForm.getRawValue() ;
    this.authStore.register(user);
    return
    }
    this.registerForm.markAllAsTouched()
  }

  ngOnDestroy(): void {
  this.authStore.clearErrorMsgs()
  }
}
