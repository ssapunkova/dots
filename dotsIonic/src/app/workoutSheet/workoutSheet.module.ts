import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { WorkoutSheetPage } from './workoutSheet.page';
import { ComponentsModule  } from '../components/components.module';


import { EditWorkoutParamsPage } from './editWorkoutParams/editWorkoutParams.page';
import { NewWorkoutRecordPage } from './newWorkoutRecord/newWorkoutRecord.page';

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
  entryComponents: [
    NewWorkoutRecordPage,
    EditWorkoutParamsPage
  ],
  declarations: [
    WorkoutSheetPage,
    NewWorkoutRecordPage,
    EditWorkoutParamsPage
  ]
})
export class WorkoutSheetPageModule {}
