import { Component } from '@angular/core';
import { ErrorOptionComponent } from "../../components/error-option.component";

@Component({
  selector: 'app-network-error',
  imports: [ErrorOptionComponent],
  template: `
  <section aria-label="Network Error Page" role="region" class="w-full">
  <app-error-option
  [status]="0"
  errorMsg="Network Error / Unknown Error"
  errorDesc="A connection error occurred. Please check your internet and try again"
  />
  </section>
  `,
})
export class NetworkErrorComponent {

}
