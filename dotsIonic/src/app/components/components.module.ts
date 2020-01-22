import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ChartTooltipComponent } from './chart-tooltip/chart-tooltip.component';

@NgModule({
  declarations: [ChartTooltipComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [ ChartTooltipComponent ]
})
export class ComponentsModule { }
