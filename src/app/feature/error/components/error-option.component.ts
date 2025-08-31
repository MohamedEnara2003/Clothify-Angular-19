import { Component, input } from '@angular/core';
import { SharedModule } from '../../../shared/modules/shared.module';

@Component({
  selector: 'app-error-option',
  imports: [SharedModule],
  template: `
    <article aria-label="Error" role="alert" class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div class="mx-auto max-w-screen-sm text-center">
            <h1  [attr.aria-label]="'Error status ' + status()" role="status"
            class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-secondary">
            {{status()}}
            </h1>
            <p [attr.aria-label]="'Error message ' + errorMsg()" role="errorMessage"
            class="mb-4 text-3xl tracking-tight font-bold text-neutral">
            {{errorMsg()}}
            </p>
            <p [attr.aria-label]="'Error description ' + errorDesc()" role="errorDescription"
            class="mb-4 text-lg font-light text-neutral/70">
            {{errorDesc()}}
            </p>
            <button routerLink="/" role="button" type="button" class="btn btn-neutral">
            <span class="material-icons">home</span>
                            {{'navigation.Back To Home' | translate}}
            </button>
        </div>   
    </article>
  `,
})
export class ErrorOptionComponent {
  status = input<number | string>(404);
  errorMsg = input<string>('Not Found');
  errorDesc = input<string>('We are already working to solve the problem.');
}
