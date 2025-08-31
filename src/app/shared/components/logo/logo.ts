import { Component, input } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';

@Component({
  selector: 'app-logo',
  imports: [SharedModule],
  template: `
  <picture title="Logo" routerLink="/">
  <img src="logo.webp" alt="Logo" aria-label="Logo" role="img" width="40" height="40" 
  [class]="styleClass()" class="cursor-pointer hover:scale-105 duration-200 transition-all">
  </picture>
  `,
})
export class Logo {
  styleClass = input<string>('');
}
