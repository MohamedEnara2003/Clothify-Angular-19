import { Component, model } from '@angular/core';

export interface ImageOption {
  src : string ,
  alt : string ,
  width  : number ,
  height : number ,
  class : string ,
  placeholder? : string ,
  loading : 'lazy' | 'eager' | null
  decoding?: 'async' | 'sync' | 'auto'; // تحسين عرض الصورة
  fetchpriority?: 'high' | 'low' | 'auto';
  referrerpolicy?: ReferrerPolicy; // سياسة الإحالة
}

@Component({
  selector: 'app-ng-image',
  imports: [],
  template: `
  <picture class="size-full">
  <img
        [src]="options().src"
        [alt]="options().alt"
        role="img"
        [width]="options().width"
        [height]="options().height"
        [class]="options().class"
        [loading]="options().loading"
        [decoding]="options().decoding || 'async'"
        [attr.fetchpriority]="options().fetchpriority || 'auto'"
        [attr.referrerpolicy]="options().referrerpolicy || 'no-referrer'"
        (error)="onError()"
      />
  </picture>
  `,
}) 
export class NgImageComponent {
public options = model.required<ImageOption>();

onError () : void {
this.options.update((prev) => ({...prev , src : prev.placeholder || '/placeholder-img.webp'}));
};

}
