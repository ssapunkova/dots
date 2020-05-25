import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { WorkoutSheetPage } from './workoutSheet.page';
import { ComponentsModule  } from '../components/components.module';

import { TranslateModule } from '@ngx-translate/core';

import { EditWorkoutParamsPage } from './editWorkoutParams/editWorkoutParams.page';

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
    NgxDatatableModule,
    ComponentsModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [
    EditWorkoutParamsPage
  ],
  declarations: [
    WorkoutSheetPage,
    EditWorkoutParamsPage
  ]
})
export class WorkoutSheetPageModule {}
