import { Component, effect, ElementRef, input, model, viewChild } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';

@Component({
  selector: 'app-search-input',
  imports: [SharedModule],
  template: `
  <label class="w-full input  bg-neutral/20">
    <span  class="material-icons">search</span>
    <input #inputRef  type="text" placeholder="Search For Products" [ngModel]="value()" (ngModelChange)="onChangeValue($event)"
    class="bg-transparent placeholder:text-neutral-500 placeholder:text-left "
    maxlength="100" >
</label>
  `,
})
export class SearchInputComponent {
  inputRef = viewChild<ElementRef<HTMLInputElement>>('inputRef');
  isFocus = input<boolean>(false);

  value = model<string>('');
  constructor(){
  effect(() => {
  if(this.isFocus()){
  this.inputRef()?.nativeElement.focus()
  }
  })
  }
  onChangeValue(value : string) : void {
  this.value.set(value);
  }
}
