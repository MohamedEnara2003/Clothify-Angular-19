import { Component, inject, input, model } from '@angular/core';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { AlertService } from '../../../../../core/services/alert.service';

@Component({
  selector: 'app-choose-quantity',
  imports: [SharedModule],
  template: `

  <nav class="grid gap-2 border border-neutral"
  [ngClass]="isColumn() ? 'w-8 h-25  grid-cols-1' :'w-25 h-8 grid-cols-3'">

    <button type="button" 
    class="size-full cursor-pointer p-0 btn btn-xs" (click)="increment()">
    <span class="material-icons" style="font-size: 1rem;">add</span>
    </button>

    <span class="w-full h-full text-center">{{quantity()}}</span>

    <button type="button" [disabled]="quantity() === 1" 
    class="size-full btn btn-xs p-0 " (click)="decrement()">
    <span class="material-icons" style="font-size: 1rem;">remove</span>
    </button>
  </nav>
  `,
})
export class ChooseQuantity {
  private readonly alert = inject(AlertService);

  isColumn = input<boolean>();
  maxQuantity = input<number>(50);
  quantity = model<number>(1);

  increment() : void {
    this.updateQuantity(1);
  }
  
  decrement() : void {
    this.updateQuantity(-1);
  }

  updateQuantity(value: number) : void {
    if (this.quantity()  >= 1 && this.quantity() + value <= this.maxQuantity()) {
    this.quantity.set(this.quantity() + value);
    return
    }

  this.alert.alertOption.set([
  {id : 1 , isLoad : true  , isLoadTime : 2000 , alertMessage : 'Quantity exceeds available stock!' 
  , alertType : 'alert-warning'
  }
  ]);

  }
}
