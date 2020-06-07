import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { CalculatorsPage } from './calculators.page';
import { CalculatorPage } from './calculator/calculator.page';

const routes: Routes = [
  {
    path: '',
    component: CalculatorsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [
    CalculatorPage
  ],
  declarations: [
    CalculatorsPage,
    CalculatorPage
  ]
})
export class CalculatorsPageModule {}
