import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { TranslateModule } from '@ngx-translate/core';

import { VitalsPage } from './vitals.page';

import { DoctorFriendlyPage } from './doctorFriendly/doctorFriendly.page';
import { EditVitalsCalculatorsPage } from './editVitalsParams/editVitalsParams.page';

import { ComponentsModule  } from '../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: VitalsPage
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
    EditVitalsCalculatorsPage,
    DoctorFriendlyPage
  ],
  declarations: [
    VitalsPage,
    EditVitalsCalculatorsPage,
    DoctorFriendlyPage
  ]
})
export class VitalsPageModule {}
