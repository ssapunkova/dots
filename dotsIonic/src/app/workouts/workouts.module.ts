import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { TranslateModule } from '@ngx-translate/core';

import { WorkoutsPage } from './workouts.page';

import { ComponentsModule  } from '../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: WorkoutsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxChartsModule,
    TranslateModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WorkoutsPage]
})
export class WorkoutsPageModule {}
