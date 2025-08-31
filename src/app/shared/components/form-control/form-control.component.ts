import { Component, inject, input, output } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { FormGroup } from '@angular/forms';
import { TranslationService } from '../../../core/services/translations/translation.service';

export interface FormControlOption {
  type : 'text' | 'number' | 'password' | 'email' | 'select' | 'textarea' ,
  formControlName : string ,
  label : string ,
  id : string,
  icon? : string ,
  isRequired? : boolean ,
  inputmode? : 'tel' | 'numeric' | 'email' | 'decimal',
  name? : string,
  inputClass? : string,
  autocomplete? : 'email' | 'postal-code' | 'username' | 'name' | 'given-name' | 'family-name' | 'sex' 
  | 'organization'  | 'street-address' | 'address-level2' | 'country-name' | 'current-password'  
  | 'new-password' | 'search' | 'tel',
  // If type select
  textForTranslate? : string ,
  selectOptions? : string[]
}


@Component({
  selector: 'app-form-control',
  imports: [SharedModule],
  template: `
  <div [formGroup]="form()" class="">

      <label class="label block mb-1 text-neutral" [for]="this.option().id">
        {{ translationService.heroTexts( option().label )}} 
  
        <span aria-hidden="true" class="text-sm font-medium"
        [ngClass]="option().isRequired ?  'text-error' : 'text-neutral/50 ' ">
        {{!option().isRequired ? ('forms.optional' | translate) : '*'}}
        </span>

      </label>

      @switch (this.option().type) {
      
        @case ('textarea') {
        <textarea 
        [id]="option().id" 
        [name]="option().name"
        [formControlName]="option().formControlName" 
        [attr.aria-describedby]="option().formControlName + 'Help'"
        autocorrect=""
        class="textarea focus:textarea-secondary w-full bg-white" 
        [ngClass]="shouldShowValidation() ? 'input-error': 'focus:input-secondary'"
        ></textarea>
        }

        @case ('select') {
        <select 
        [id]="option().id" 
        [name]="option().name"
        [formControlName]="option().formControlName" 
        class="select  w-full" 
        aria-selected="true"
        [attr.aria-required]="option().isRequired"
        [attr.aria-describedby]="option().formControlName + 'Help'"
        [ngClass]="shouldShowValidation() ? ' select-error' : 'focus:select-secondary'">
        @for (o of this.option().selectOptions; track o) {
        @let option =  this.option().textForTranslate  ? this.option().textForTranslate + o : o;
        <option [value]="o">{{
        translationService.heroTexts(option)}}
        </option>
        }
        </select> 
        }

        @default {
        <label  class="input w-full bg-white">

        @if(option().icon){
        <span  aria-hidden="true"
        (click)="onClickIcon.emit()" class="material-icons text-neutral">
        {{option().icon}}
        </span>
        }

        <input  
        [id]="option().id" 
        [formControlName]="option().formControlName" 
        [type]="option().type"
        [name]="option().name"
        [inputMode]="option().inputmode"
        [attr.aria-required]="option().isRequired"
        [attr.aria-describedby]="option().formControlName + 'Help'"
        [autocomplete]="option().autocomplete || ''"
        class="bg-white"
        [ngClass]="shouldShowValidation() ? 'input-error': 'focus:input-secondary'"
        />
        </label>
        }
      }
          @if (shouldShowValidation() ) {
          <p class="text-error text-sm mt-1 flex items-center gap-1">
          <span class="material-icons text-xs" style="font-size: 1.2rem;">error</span>
          {{shouldShowErrorsValidation()}}
          </p>
          }
  </div>
  `,
})
export class FormControlComponent {
  translationService = inject(TranslationService)
  form = input.required<FormGroup>()
  option = input.required<FormControlOption>();

  onClickIcon = output<void>();


  shouldShowValidation() : boolean {
    const control = this.form().controls[this.option().formControlName];
    return control ? (control.invalid && control.touched) : false;
  }

  shouldShowErrorsValidation() : string {
  const controlName = this.option().formControlName;
  const control  = this.form().controls[controlName]

  if(!control) return '' ;
  const errors = control.errors ;
  if(!errors) return '';

  if(errors['required']) {
  return `${controlName} ${this.translationService.heroTexts('messages.required')}`;
  }

  if(control.errors['email']) return `${controlName} is not valid`;

  if (errors['email']) return this.translationService.heroTexts('messages.invalid');

  if (errors['min']) {
    return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} 
    ${this.translationService.heroTexts('messages.min')}`;
  }

    if (errors['max']) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} 
      ${this.translationService.heroTexts('messages.max')}`;
    }
    if (errors['invalidSize']) {
      return this.translationService.heroTexts('messages.invalidSize');
    }

    if (errors['pattern'] && controlName === 'phone') 
    return this.translationService.heroTexts('messages.invalid');

    if (errors['minlength']) {
      if (controlName === 'postalCode') {
      return this.translationService.heroTexts('messages.minLength');
      }
      return this.translationService.heroTexts('messages.minLength');
    }

    if (errors['maxlength']) {
      if (controlName === 'postalCode') {
      return this.translationService.heroTexts('messages.maxlength');
      }
      return this.translationService.heroTexts('messages.maxlength');
    }

  return `${controlName} ${this.translationService.heroTexts('messages.invalid')}`;
  }
  
}
