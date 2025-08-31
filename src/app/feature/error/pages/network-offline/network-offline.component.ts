import { Component } from '@angular/core';
import { ErrorOptionComponent } from "../../components/error-option.component";

@Component({
  selector: 'app-network-offline',
  imports: [ErrorOptionComponent],
  template: `
  <section aria-label="Network Offline Page" role="region" class="w-full">
  <app-error-option
  status="Offline"
  errorMsg="No Internet Connection"
  errorDesc="You are currently offline. Please check your network connection."
  />
  </section>
  `,
})
export class NetworkOfflineComponent {

}
