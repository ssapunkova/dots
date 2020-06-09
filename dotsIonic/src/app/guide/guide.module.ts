import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';


import { TranslateModule } from '@ngx-translate/core';
import { GuidePage } from './guide.page';

const routes: Routes = [
  {
    path: '',
    component: GuidePage
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
  declarations: [GuidePage]
})
export class GuidePageModule {}
