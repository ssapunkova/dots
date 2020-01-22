import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ChartTooltipComponent } from './chart-tooltip/chart-tooltip.component';
import { ChartLegendComponent } from './chart-legend/chart-legend.component';
import { DataTableComponent } from './data-table/data-table.component';

@NgModule({
  declarations: [
    ChartTooltipComponent,
    ChartLegendComponent,
    DataTableComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    ChartTooltipComponent,
    ChartLegendComponent,
    DataTableComponent
  ]
})
export class ComponentsModule { }
