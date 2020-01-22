import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { WorkoutSheetPage } from './workoutSheet.page';
import { ComponentsModule  } from '../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: WorkoutSheetPage
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
  declarations: [WorkoutSheetPage]
})
export class WorkoutSheetPageModule {}
