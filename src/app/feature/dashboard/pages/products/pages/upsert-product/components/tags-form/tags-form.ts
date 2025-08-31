import { Component, effect, input } from '@angular/core';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { SharedModule } from '../../../../../../../../shared/modules/shared.module';
import { Tags } from '../../../../../../../../core/interfaces/products.interface';

@Component({
  selector: 'app-tags-form',
  imports: [SharedModule],
  template: `
      
      <div [formGroup]="form()">
          <label class="label  mb-1 font-bold text-neutral">
          {{'labels.Select Tags' | translate}} <span class="text-neutral/50 text-sm font-medium">
          {{'forms.optional' | translate}}</span>
          </label>

          <div formArrayName="tags" class="flex items-center flex-wrap gap-2">
            @for (tag of tags.controls; let i = $index; track tag) {
              <div class="flex justify-center items-center gap-2">
                <select 
                  [id]="'tag-' + i" 
                  [formControlName]="i" 
                  class="select  w-24" 
                  [ngClass]="tag.invalid && tag.touched ? 'select-error' : 'focus:select-secondary'"
                  aria-label="Product Tag">
                  @for (tag of getAvailableTagOptionsForIndex(i); track tag) {
                    <option [value]="tag">{{'tags.' + tag | translate}}</option>
                  }
                </select>
    
              <button type="button"  aria-label="Remove Tag" role="button" 
              class="material-icons btn btn-sm  btn-circle btn-secondary" 
              (click)="removeTag(i)" >
              close
              </button>

              </div>
            }
            @if (getAvailableTagOptions().length > 0) {
              <button type="button" role="button" class="btn btn-neutral btn-sm" (click)="addTag()" 
              aria-label="Add Tag">
                <span class="material-icons ">add</span>
                {{'buttons.Add Tag' | translate}}
            </button>
            }
          </div>
          @if (this.form().get('tags')?.errors) {
            <div class="text-warning text-sm mt-1 flex items-center gap-1">
              <span class="material-icons text-xs">warning</span>
              <span>{{'messages.atLeastOneTag' | translate}}</span>
            </div>
          }
        </div>
  `,
  styles: ``
})
export class TagsForm {
  private fb = new FormBuilder();
  form = input.required<FormGroup>();
  existingTags = input<string[]>([]);
  tagOptions: Tags[] = ['New', 'Sale', 'Popular', 'Limited', 'Featured', 'Best Seller']

  get tags() {
    return this.form().get('tags') as FormArray;
  }

  constructor(){
    effect(() => {
    this.getExistingProductTags();
    })
  }

  private getExistingProductTags() : void {
  const existingTags = this.existingTags();
  if(existingTags){
    existingTags.forEach((tag) => {
      this.tags.push(this.fb.control(tag));
    })
  }
}

    // Tags
    addTag() {
    this.tags.push(this.fb.control(''));
    }

    removeTag(index: number) {
        this.tags.removeAt(index);
    }

    getAvailableTagOptions(): string[] {
        const selectedTags = this.tags.controls.map(control => control.value).filter(value => value);
        return this.tagOptions.filter(option => !selectedTags.includes(option));
      }
    
    getAvailableTagOptionsForIndex(index: number): string[] {
        const selectedTags = this.tags.controls.map((control, i) => i !== index ? control.value : null).filter(value => value);
        return this.tagOptions.filter(option => !selectedTags.includes(option));
    }
    
}
