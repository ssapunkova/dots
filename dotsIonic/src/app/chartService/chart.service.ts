import { Injectable } from '@angular/core';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';


// Chart Service
// Implements sorting the data, displayed in ion-grid

@Injectable()
export class ChartService{

  chartData = [];

  constructor(
    public d3: d3
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
