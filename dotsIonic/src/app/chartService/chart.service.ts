import { Injectable } from '@angular/core';

import { NgxChartsModule } from '@swimlane/ngx-charts';


// Chart Service
// Implements sorting the data, displayed in ion-grid

@Injectable()
export class ChartService{

  chartData = [];

  constructor(
    // public d3: d3
  ){}

  async generateData() {
   for (let i = 0; i < (8 + Math.floor(Math.random() * 10)); i++) {
   this.chartData.push([
   `Index ${i}`,
   Math.floor(Math.random() * 100)
   ]);
  }
}

}
