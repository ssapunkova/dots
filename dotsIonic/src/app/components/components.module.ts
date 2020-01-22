import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { FormsModule } from '@angular/forms';

import { ChartTooltipComponent } from './chart-tooltip/chart-tooltip.component';
import { ChartLegendComponent } from './chart-legend/chart-legend.component';
import { DataTableComponent } from './data-table/data-table.component';
import { ToggleShowingMode } from './toggle-showing-mode/toggle-showing-mode.component';


@NgModule({
  declarations: [
    ChartTooltipComponent,
    ChartLegendComponent,
    DataTableComponent,
    ToggleShowingMode
  ],
  imports: [
    CommonModule,
    IonicModule,
    NgxChartsModule,
    FormsModule
  ],
  exports: [
    ChartTooltipComponent,
    ChartLegendComponent,
    DataTableComponent,
    ToggleShowingMode
  ]
})
export class ComponentsModule { }
