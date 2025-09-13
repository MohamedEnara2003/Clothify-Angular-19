import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../../../shared/modules/shared.module';
import { OrderStore } from '../../../../../store/orders/orders.signal';
import { Payment } from "../../payment/ui/payment";
import { UserOrderData } from '../../../../../core/interfaces/order.interface';
import { FormControlComponent } from "../../../../../shared/components/form-control/form-control.component";
import { CheckoutService } from '../../../service/checkout.service';

@Component({
  selector: 'app-information',
  imports: [SharedModule, Payment, FormControlComponent],
  template: `
  <section aria-label="Section Information" role="section" class="w-full">
  <form [formGroup]="informationForm" (ngSubmit)="onSubmit()" role="form"
  class="w-full grid grid-cols-1 gap-2 py-4 text-neutral">

  @for (fieldset of checkoutService.checkoutFieldsets(); track fieldset.legend) {
    <fieldset class="fieldset">
      <legend class="legend text-neutral md:text-base text-sm font-semibold pb-2 uppercase">
        {{ fieldset.legend | translate }}
      </legend>
      
      @for (field of fieldset.fields; track field.id) {
        <app-form-control
          [option]="field"
          [form]="informationForm"
        />
      }
    </fieldset>
  }

    <app-payment />
  
    <div class="w-full grid grid-cols-1  justify-items-end-safe">
      <button type="submit" aria-label="Button Shipping" role="button" 
      class="w-full  btn btn-lg btn-active bg-blue-500 hover:bg-blue-600 duration-300 transition-colors text-white 
      font-semibold">
        {{ 'checkout.Place Order' | translate }}
      </button>
    </div>
  </form>
  </section>
  `,
  providers : [CheckoutService]
})
export class Information implements OnInit {
  private orderStore = inject(OrderStore);
  public checkoutService = inject(CheckoutService);
  public informationForm!: FormGroup;


  constructor(
    private fb: FormBuilder ,
  ) {}

  ngOnInit() {
    this.informationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(50)]],
      phone: ['', [
      Validators.required,
      Validators.pattern(/^01[0125][0-9]{8}$/),
      ]],
      firstName: ['', [Validators.required , Validators.minLength(3), Validators.maxLength(50)]],
      lastName: ['', [Validators.required , Validators.minLength(3), Validators.maxLength(50)]],
      country: [{value: 'Egypt', disabled: true }, [Validators.required ]],
      address: ['', [Validators.required , Validators.minLength(3), Validators.maxLength(50)]],
      stateRegion: ['' , [Validators.minLength(3), Validators.maxLength(50)]],
      city: ['' , [Validators.minLength(3), Validators.maxLength(50)]],
      postalCode: ['' , [Validators.minLength(5), Validators.maxLength(5)]]
    });
  }

  onSubmit() {
    if (this.informationForm.valid) {
      const userData : UserOrderData = this.informationForm.getRawValue();
      this.orderStore.createOrder(userData)
      return
    }
    this.informationForm.markAllAsTouched();
  }
}
