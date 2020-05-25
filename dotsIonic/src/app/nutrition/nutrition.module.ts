import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { BrowserModule } from '@angular/platform-browser';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { TranslateModule } from '@ngx-translate/core';

import { NutritionPage } from './nutrition.page';

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
    NgxDatatableModule,
    ComponentsModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [
    EditNutritionParamsPage
  ],
  declarations: [
    NutritionPage,
    EditNutritionParamsPage
  ]
})
export class NutritionPageModule {}
