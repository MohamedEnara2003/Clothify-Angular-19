import { Injectable, signal } from '@angular/core';
import { FormControlOption } from '../../../shared/components/form-control/form-control.component';

@Injectable()

export class CheckoutService {

  public checkoutFieldsets = signal<Array<{
  legend : string ,
  fields : FormControlOption[]
  }>>([
  {
    legend: 'checkout.Billing Information',
    fields: [
      {
        type: 'email',
        id: 'email',
        name: 'email',
        label: 'checkout.Email',
        formControlName: 'email',
        isRequired: true,
        inputmode: 'email',
      },
      {
        type: 'number',
        id: 'phone',
        name: 'phone',
        label: 'checkout.Phone',
        formControlName: 'phone',
        isRequired: true,
        inputmode: 'tel',
      },
    ],
  },
  {
    legend: 'checkout.Shipping Information',
    fields: [
      {
        type: 'text',
        id: 'firstName',
        name: 'firstName',
        label: 'checkout.First Name',
        formControlName: 'firstName',
        isRequired: true,
      },
      {
        type: 'text',
        id: 'lastName',
        name: 'lastName',
        label: 'checkout.Last Name',
        formControlName: 'lastName',
        isRequired: true,
      },
      {
        type: 'text',
        id: 'country',
        name: 'country',
        label: 'checkout.Country',
        formControlName: 'country',
        isRequired: true,
      },
      {
        type: 'text',
        id: 'stateRegion',
        name: 'stateRegion',
        label: 'checkout.State',
        formControlName: 'stateRegion',
      },
      {
        type: 'text',
        id: 'address',
        name: 'address',
        label: 'checkout.Address',
        formControlName: 'address',
        isRequired: true,
      },
      {
        type: 'text',
        id: 'city',
        name: 'city',
        label: 'checkout.City',
        formControlName: 'city',
      },
      {
        type: 'number',
        id: 'postalCode',
        name: 'postalCode',
        label: 'checkout.Zip Code',
        formControlName: 'postalCode',
        inputmode: 'numeric',
      },
    ],
  },
]);

}
