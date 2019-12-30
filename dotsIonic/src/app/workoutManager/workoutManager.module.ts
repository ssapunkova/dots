import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { WorkoutManagerPage } from './workoutManager.page';

const routes: Routes = [
  {
    path: '',
    component: WorkoutManagerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxChartsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [WorkoutManagerPage]
})
export class WorkoutManagerPageModule {}
