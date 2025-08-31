import { Component, inject, input, signal } from '@angular/core';
import { UploadFiles } from '../../../../../core/services/upload-files.service';
import { UploadImage } from '../../../../../core/interfaces/files.interface';
import { catchError, of, tap } from 'rxjs';
import { PaymentMethod } from '../../../interface/checkout.interface';
import { OrderStore } from '../../../../../store/orders/orders.signal';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { NgImageComponent } from "../../../../../shared/components/ng-image/ng-image.component";


@Component({
  selector: 'app-upload-receipt',
  imports: [SharedModule, NgImageComponent],
  template: `
  <section  class="animate-down w-full p-4 bg-white shadow rounded-xl"
  role="form"
  aria-labelledby="upload-receipt-title">

  <header>
  <h2 id="upload-receipt-title" class="text-xl font-semibold mb-4 text-center">
    {{ 'checkout.Send Payment Receipt' | translate }}
  </h2>

  <article class="mb-4 bg-gray-100 p-1 rounded-xl shadow flex flex-col items-center" role="note" aria-live="polite">
    <p class="font-medium text-neutral">
      {{ 'checkout.Please send the payment to this number' | translate }}
    </p>
    <p class="text-xl font-bold text-secondary tracking-wide">
      {{adminNumber()}}
    </p>
  </article>
  </header>

  <form  aria-describedby="form-description">

    <div class="mb-4">
      <label for="receiptImage" class="block mb-1 font-medium">
        {{ 'checkout.Upload Screenshot' | translate }}
      </label>
      <input 
        type="file"
        id="receiptImage"
        accept="image/*"
        required
        class="w-full file-input file-input-neutral bg-white"
        aria-required="true"
        aria-label="Upload payment screenshot"
        accept="image/*"
        (change)="uploadFile($event)"
      />
    </div>

  
    <div  class="mb-4 rounded border w-full h-60  p-2 relative" aria-live="polite">
      @if(isLoading()) {
      <div class="absolute inset-0 flex items-center justify-center">
      <span class="loading loading-spinner size-15 text-secondary"></span>
      </div>
      }@else { 
        <app-ng-image
        [options]="{
        src : imagePreview() ? imagePreview()?.img_url || '' : 
        paymentMethod() === 'Vodafone-Cash' ? 'vodafone-cash.webp' : 'instapay.webp' ,
        alt : 'Preview of uploaded receipt image' ,
        width :  250 , 
        height : 250 ,
        class : 'size-full object-contain' ,
        loading : 'lazy' ,
        decoding : 'async'
        }"
        />
    @if(imagePreview()) {
      <button type="button" class="btn btn-circle btn-sm absolute top-2 right-0 z-50" (click)="removeImage()">
      <span class="material-icons-outlined">close</span>
      </button>
    }
    }
    </div>
  </form>

  @if(orderStore.receiptErrorMsg()){
  <p class="text-error text-sm px-5 pb-5">{{orderStore.receiptErrorMsg()}}</p>
  }
  
</section>
`,
  providers : [UploadFiles]
})
export class UploadReceiptComponent {
  private readonly uploadFileService = inject(UploadFiles);
  readonly orderStore = inject(OrderStore);

  adminNumber = input.required<string>();
  paymentMethod = input.required<PaymentMethod>();

  imagePreview = signal<UploadImage | null>(null);
  isLoading = signal(false);
  
  uploadFile(event: Event) : void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.isLoading.set(true);
      const file = input.files[0];
      this.uploadFileService.uploadFiles([file]).pipe(
        tap(({data}) => {
          this.isLoading.set(false);
          this.imagePreview.set(data[0]);
          this.orderStore.uploadReceipt({receipt_img : data[0].img_url , receipt_id : data[0].img_id})
        }),
        catchError(() => {
          this.isLoading.set(false);
          return of(null);
        })
      ).subscribe()
    }
  }

  removeImage() : void {
  const imageId = this.imagePreview()?.img_id;
  if(imageId) {
  this.uploadFileService.removeFiles(imageId).subscribe()
  this.imagePreview.set(null);
  }
  }

}
