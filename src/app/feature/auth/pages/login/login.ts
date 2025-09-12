import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainFields } from "../../shared/components/main-fields/main-fields";
import { SharedModule } from '../../../../shared/modules/shared.module';
import { authData } from '../../../../core/interfaces/user.interface';
import { AuthStore } from '../../../../store/auth/auth.signal';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  imports: [MainFields , SharedModule, TranslateModule],
  template: `
  <section aria-label="Login Page" role="region"  class="size-full flex justify-center items-center bg-white py-5 rounded shadow">
  <form [formGroup]="loginForm" (ngSubmit)="onLoginSubmit()" role="form"  aria-label="Authentication Form"
  class="w-xs xs:w-sm sm:w-2xl md:w-lg xl:w-2xl 2xl:w-3xl">
    
 
    <app-main-fields [formGroup]="loginForm" class="w-full flex justify-center items-center">

  <legend id="form-legend" class="text-neutral w-full fieldset-legend  text-2xl  grid grid-cols-1">
  {{ 'auth.login' | translate }}   
  @if(authStore.loginErrorMsg()){
  <p class=" text-error text-sm animate-up">{{authStore.loginErrorMsg()}}</p>
  }
  </legend> 

  <button 
    formBtn 
    type="submit"
    class="btn btn-neutral mt-4" 
    [attr.aria-label]="'auth.submitLogin' | translate"
    role="button"
  >
    {{ 'auth.login' | translate }}
  </button>
  </app-main-fields>

  <nav class="flex justify-center items-center gap-1" role="navigation">
  <p class="text-neutral">{{ 'auth.dontHaveAccount' | translate }}</p>
  <a href="/auth/register"  routerLink="/auth/register" aria-label="Login Page Link" class="link link-secondary"> 
  {{ 'auth.createOne' | translate }}
  </a>
  </nav>
  </form>
  </section>
  `,
})
export class Login implements OnInit , OnDestroy{
  readonly authStore = inject(AuthStore);
  loginForm!: FormGroup;

  constructor(
  private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email , Validators.maxLength(254)]],
      password: ['', [Validators.required, Validators.minLength(8) , Validators.maxLength(80)]]
    });
  }

  onLoginSubmit() {
  if(this.loginForm.valid){
  const user : authData = this.loginForm.getRawValue() ;
  this.authStore.login(user);
  return
  }
  this.loginForm.markAllAsTouched();
  }

  ngOnDestroy(): void {
  this.authStore.clearErrorMsgs()
  }
}
