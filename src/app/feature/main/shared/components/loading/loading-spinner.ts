import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  imports: [],
  template: `
    <article aria-label="Container loading" role="article" class="size-full flex justify-center items-center">
    <span aria-label="Loading spinner" aria-hidden="true" role="spinbutton" 
    [class]="'loading loading-spinner text-secondary ' + styleClass() " >
    </span>
    </article>
  `, 
})
export class LoadingSpinner {
  styleClass = input<string>('size-20')
}
