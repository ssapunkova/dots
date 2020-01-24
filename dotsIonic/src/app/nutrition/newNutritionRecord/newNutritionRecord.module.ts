import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewNutritionRecordPage } from './newNutritionRecord.page';

import { ComponentsModule  } from '../../components/components.module';

@NgModule({
  declarations: [NewNutritionRecordPage],
  imports: [
    CommonModule,
    ComponentsModule
  ],

})
export class NewNutritionRecordModule { }
