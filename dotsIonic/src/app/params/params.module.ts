import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ParamsPage } from './params.page';
import { CalculatorPage } from './calculator/calculator.page';

const routes: Routes = [
  {
    path: '',
    component: ParamsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [
    CalculatorPage
  ],
  declarations: [
    ParamsPage,
    CalculatorPage
  ]
})
export class ParamsPageModule {}
