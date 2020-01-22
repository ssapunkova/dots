import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ChartTooltipComponent } from './chart-tooltip/chart-tooltip.component';
import { ChartLegendComponent } from './chart-legend/chart-legend.component';

@NgModule({
  declarations: [
    ChartTooltipComponent,
    ChartLegendComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    ChartTooltipComponent,
    ChartLegendComponent
  ]
})
export class ComponentsModule { }
