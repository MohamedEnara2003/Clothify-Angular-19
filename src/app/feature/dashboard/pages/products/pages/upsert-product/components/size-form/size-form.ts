import { Component, effect, input, model } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { SharedModule } from '../../../../../../../../shared/modules/shared.module';
import { ProductSize, SizesType } from '../../../../../../../../core/interfaces/products.interface';
import { FormControlComponent } from "../../../../../../../../shared/components/form-control/form-control.component";


@Component({
  selector: 'app-size-form',
  imports: [SharedModule, FormControlComponent],
  template : `
<div [formGroup]="form()">
  @let isAccessories = form().get('category')?.value === 'ACCESSORIES';

      @if(!isAccessories){ 
      <label class="label  mb-1 font-bold text-neutral">
      {{isAccessories  ? ('labels.Stock' | translate) : ('labels.Sizes And Stock' | translate)}} <span class="text-error">*</span>
      </label>

      <div formArrayName="sizes" class="space-y-2">
          @for (size of sizes.controls; let i = $index; track size) {
          <div [formGroupName]="i" 
          class="flex flex-col  sm:flex-row gap-4 items-start border-b border-b-neutral/20 py-1">
        
          @if(sizes.controls.length > 0){
          <app-form-control
          [option]="{
          type : 'select' ,
          formControlName : 'size',
          label : 'labels.Select Size' ,
          id : 'product-size' ,
          isRequired : true ,
          selectOptions : availableSizeOptions(i) ,
          }"
          [form]="asFormGroup(sizes.controls[i])"
          class="w-full"
          />

          <app-form-control
          [option]="{
          type : 'number' ,
          formControlName : 'stock',
          label : 'labels.Stock' ,
          id : 'product-stock' ,
          isRequired : true ,
          }"
          [form]="asFormGroup(sizes.controls[i])"
          class="w-full"
          />
    
          <button type="button" role="button" aria-label="Remove Size" 
          class="material-icons btn btn-circle btn-sm" 
          (click)="removeSize(i)" >
          close
          </button>
          }
        </div>
          }
    
    <button type="button" role="button" aria-label="Add Size" class="btn btn-neutral btn-sm mt-2" 
    (click)="addSize()" >
      <span class="material-icons ">add</span>
      {{'buttons.Add Size' | translate}}
    </button>

    @if(this.isSubmitted()){
      <p class="text-error text-sm mt-1 flex items-center gap-1">
      <span class="material-icons text-xs" style="font-size: 1.2rem;">error</span>
      {{'messages.atLeastOneSize' | translate}}
      </p>
    }
</div>
}@else {
  <app-form-control
  [option]="{
  type : 'number' ,
  formControlName : 'stock',
  label : 'labels.Stock' ,
  id : 'product-stock' ,
  isRequired : true ,
  }"
  [form]="form()"
  class="w-full"
  />
}
</div>
  `, 
})
export class SizeForm {
  form = input.required<FormGroup>();
  existingSizes = input<ProductSize[]>([]);
  isSubmitted = input<boolean>(false);
  
  sizesValues = model<SizesType[]>([]);
  private fb = new FormBuilder();


  get sizes() : FormArray {
  return this.form().get('sizes') as FormArray;
  }

  constructor(){
    effect(() => {
      this.sizes.controls.forEach(control => {
        const sizeControl = (control as FormGroup).get('size');
        if (sizeControl) {
          sizeControl.updateValueAndValidity();
        }
      });

    this.getExistingProductSizes();
    })
  }
  


  asFormGroup(control: AbstractControl): FormGroup {
  return control as FormGroup;
  }


  private getExistingProductSizes() : void {
  const existingSizes = this.existingSizes();
  if(existingSizes){
    existingSizes.forEach(({size ,stock , _id}) => {
      this.sizes.push(this.fb.group({
        _id: [_id || null],
        size: [size || '', [Validators.required]],
        stock: [stock || 0, [Validators.required, Validators.min(0), Validators.max(100000)]]
      }));
    })
  }
  }

  addSize() {
    this.sizes.push(this.fb.group({
      _id: [null],
      size: ['', [Validators.required]],
      stock: [0, [Validators.required, Validators.min(0), Validators.max(100000)]]
    }));
  }

  removeSize(index: number) {
  this.sizes.removeAt(index);
  }

    availableSizeOptions(currentIndex: number): SizesType[] {
    const selectedSizes = this.sizes.controls
      .map((control, i) => i !== currentIndex ? control.get('size')?.value : null)
      .filter(v => v);
    return this.sizesValues().filter(size => !selectedSizes.includes(size));
  }
}
