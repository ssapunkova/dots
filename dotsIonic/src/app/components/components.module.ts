import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartTooltipComponent } from './chart-tooltip/chart-tooltip.component';

@NgModule({
  declarations: [ChartTooltipComponent],
  imports: [
    CommonModule
  ],
  exports: [ ChartTooltipComponent ]
})
export class ComponentsModule { }
