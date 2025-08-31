import { Component } from '@angular/core';
import { ErrorOptionComponent } from "../../components/error-option.component";

@Component({
  selector: 'app-server-error',
  imports: [ErrorOptionComponent],
  template: `
  <section aria-label="Network Error Page" role="region" class="w-full">
  <app-error-option
  [status]="500"
  errorMsg="Internal Server Error"
  errorDesc="An unexpected error occurred on the server. We're working on it. Please try again later."
  />
  </section>
  `,
})
export class ServerErrorComponent {

}
