import { Component, inject, input, model, signal } from '@angular/core';
import { SharedModule } from '../../../../../../../../shared/modules/shared.module';
import { UploadFiles } from '../../../../../../../../core/services/upload-files.service';
import { map, tap } from 'rxjs';
import { UploadImage } from '../../../../../../../../core/interfaces/files.interface';
import { TranslateService } from '@ngx-translate/core';
import { NgImageComponent } from "../../../../../../../../shared/components/ng-image/ng-image.component";
import { CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-upload-product-images',
  imports: [SharedModule, NgImageComponent],
  template: `
  <section  aria-label="Section Upload Product Images" class="w-full space-y-4">
    
  <div>
  <label class="label block mb-1 text-neutral" for="product-images">
  {{'labels.Product Images' | translate}} <span class="text-error">*</span>
  </label>
  <input type="file" id="product-images"
  name="Upload Product Imag" placeholder="{{'labels.Upload Product Image' | translate}}"
  class="file-input file-input-neutral"   multiple 
  (change)="uploadFiles($event)" accept="image/*"/>
  </div>

  <nav class="w-full" aria-label="Container Product Images" role="navigation">
  <ul cdkDropList aria-label="Menu Product Images" role="menu" class="flex items-center gap-2"
  [cdkDropListData]="productImages()"
  (cdkDropListDropped)="drop($event)">

  @for (item of productImages(); let i = $index ; track item.img_id) {
  <li cdkDrag class="avatar rounded-2xl relative border overflow-hidden  flex justify-center items-end">
        <app-ng-image
        [options]="{
        src : item.img_url ,
        alt : 'Product image-' + item.img_id ,
        width :  80 , 
        height : 80 ,
        class : 'rounded-xl shadow shadow-neutral' ,
        loading : 'lazy' ,
        decoding : 'async'
        }"
        class="mask mask-squircle size-20"
        />  
  <button [title]="'Remove Image-' +  (i + 1)"
  (click)="removeImage(item.img_id)" type="button" role="button" aria-label="Remove Product Image"
  class="material-icons absolute right-0 top-0 btn btn-sm  btn-circle  btn-secondary">
  close
  </button>

  <button cdkDragHandle [title]="'Drag product ' +  (i + 1)"
  aria-label="Button drag handle"  aria-hidden="true" role="button"
  type="button" class="material-icons btn btn-xs  btn-square  text-neutral cursor-grab hover:scale-105
  duration-300  transition-all absolute  bottom-0" >
  drag_indicator
  </button> 
  </li>
  }

  
  @for (isLoading of isImagesLoading(); track $index) {
  @if(isLoading){
  <li class="size-20  avatar rounded-xl shadow shadow-neutral  relative  
  flex justify-center items-center">
  <span class="loading loading-spinner text-neutral  size-12 border"></span>
  </li>
  }
  }
  </ul>


  @if(msgError()){
  <div class="text-error text-sm  flex items-center gap-1">
  <span class="material-icons text-xs">error</span>
  <span>{{msgError()}}</span>
  </div>
  }

  @if(productImages().length === 0 && isSubmitted() ){
      <div class="text-error text-sm  flex items-center gap-1">
      <span class="material-icons text-xs">error</span>
      <span>{{'messages.productImageRequired' | translate}}</span>          
      </div>
    }
  </nav>

  </section>
  `,
})
export class UploadProductImages {
  private uploadFilesSerive  = inject(UploadFiles);
  private translateService = inject(TranslateService);

  productImages = model<UploadImage[]>([]);
  isSubmitted = input<boolean>(false);

  isImagesLoading = signal<boolean[]>([false]);
  msgError = signal<string>('');

  

  drop(event: CdkDragDrop<UploadImage[]>) : void {
  const currentImages= this.productImages();
  moveItemInArray(currentImages, event.previousIndex, event.currentIndex);
  this.productImages.set(currentImages);
  }

  uploadFiles(event: Event): void {
  const files =  Array.from((event.target as HTMLInputElement).files! );
    if (files.length > 0 && files.length <= 6) {
      this.initLoading(files.map(() => true));

      this.uploadFilesSerive.uploadFiles(files).pipe(
      map(({data}) => ({
      newImages : data ,
      isImagesLoading : data.map(() => false),
      })),
      tap(({newImages , isImagesLoading}) => {
      this.initLoading(isImagesLoading);
      this.productImages.update((images) => [...images , ...newImages]);
      })
      ).subscribe();
    return;
    }
  this.msgError.set(this.translateService.instant('messages.maxImagesUpload'));
  }

  removeImage(imgId: string): void {
  this.uploadFilesSerive.removeFiles(imgId).pipe(
  tap(() =>  this.productImages.update((images) => images.filter((item) => item.img_id !== imgId)))
  ).subscribe();
  }

  initLoading(isLoading: boolean[]): void {
  this.isImagesLoading.set(isLoading);
  }
}
