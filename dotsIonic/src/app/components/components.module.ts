import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { ChartTooltipComponent } from './chart-tooltip/chart-tooltip.component';
import { ChartLegendComponent } from './chart-legend/chart-legend.component';
import { DataTableComponent } from './data-table/data-table.component';
import { ToggleShowingMode } from './toggle-showing-mode/toggle-showing-mode.component';
import { ToggleRegisterLogin } from './toggle-register-login/toggle-register-login.component';
import { PercentageChip } from './percentage-chip/percentage-chip.component';


@NgModule({
  declarations: [
    ChartTooltipComponent,
    ChartLegendComponent,
    DataTableComponent,
    ToggleShowingMode,
    PercentageChip,
    ToggleRegisterLogin
  ],
  imports: [
    CommonModule,
    IonicModule,
    NgxChartsModule,
    FormsModule,
    TranslateModule,
    RouterModule
  ],
  exports: [
    ChartTooltipComponent,
    ChartLegendComponent,
    DataTableComponent,
    ToggleShowingMode,
    PercentageChip,
    ToggleRegisterLogin
  ]
})
export class ComponentsModule { }
