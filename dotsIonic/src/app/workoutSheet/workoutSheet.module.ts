import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { WorkoutSheetPage } from './workoutSheet.page';
import { ComponentsModule  } from '../components/components.module';

import { TranslateModule } from '@ngx-translate/core';

import { EditWorkoutCalculatorsPage } from './editWorkoutParams/editWorkoutParams.page';

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
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [
    EditWorkoutCalculatorsPage
  ],
  declarations: [
    WorkoutSheetPage,
    EditWorkoutCalculatorsPage
  ]
})
export class WorkoutSheetPageModule {}
