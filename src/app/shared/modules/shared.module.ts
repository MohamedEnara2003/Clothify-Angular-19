import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {ReactiveFormsModule , FormsModule} from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {TranslateDirective, TranslatePipe } from '@ngx-translate/core';

const Imports = [
  CommonModule,
  RouterModule,
  ReactiveFormsModule,
  FormsModule,
  NgxSliderModule,
  DragDropModule,
  TranslatePipe, 
  TranslateDirective
]

@NgModule({
  declarations: [],
  imports: [...Imports],
  exports : [...Imports],
})
export class SharedModule { }
