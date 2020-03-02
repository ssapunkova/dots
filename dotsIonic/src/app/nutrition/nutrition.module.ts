import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { NutritionPage } from './nutrition.page';

import { NewNutritionRecordPage } from './newNutritionRecord/newNutritionRecord.page';
import { EditNutritionParamsPage } from './editNutritionParams/editNutritionParams.page';

import { ComponentsModule  } from '../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: NutritionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxChartsModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [
    NewNutritionRecordPage,
    EditNutritionParamsPage
  ],
  declarations: [
    NutritionPage,
    NewNutritionRecordPage,
    EditNutritionParamsPage
  ]
})
export class NutritionPageModule {}
