import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CalculatePage } from './calculate.page';
import { CalculatorPage } from './calculator/calculator.page';

const routes: Routes = [
  {
    path: '',
    component: CalculatePage
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
    CalculatePage,
    CalculatorPage
  ]
})
export class CalculatePageModule {}
