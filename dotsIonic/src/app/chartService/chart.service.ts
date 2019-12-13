import { Injectable } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';


// Chart Service
// Implements sorting the data, displayed in ion-grid

@Injectable()
export class ChartService{

  chartData: [];

  // chartData = [{
  //   "name": "Germany",
  //   "series": [
  //     {
  //       "name": "2010",
  //       "value": 7300000
  //     },
  //     {
  //       "name": "2011",
  //       "value": 8940000
  //     }
  //   ]
  // },
  //
  // {
  //   "name": "USA",
  //   "series": [
  //     {
  //       "name": "2010",
  //       "value": 7870000
  //     },
  //     {
  //       "name": "2011",
  //       "value": 8270000
  //     }
  //   ]
  // },
  // {
  //   "name": "France",
  //   "series": [
  //     {
  //       "name": "2010",
  //       "value": 5000002
  //     },
  //     {
  //       "name": "2011",
  //       "value": 5800000
  //     }
  //   ]
  // }];

  async formatChartData(data){
    console.log(data);

    let formatted = [];

    for(var i = 0; i < data.length; i++){

      let currentSeries = [];

      for(var j = 0; j < data[i].Values.length; j++){
        currentSeries.push({
          "name": j,
          "value": data[i].Values[j]
        })
      }

      formatted.push({
        "name": data[i].Date,
        "series": currentSeries
      });
    }

    this.chartData = formatted;

    console.log(this.chartData)
  }

  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  legendPosition: string = 'below';
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Workouts';
  showYAxisLabel: boolean = true;
  xAxisLabel = 'Date';

  constructor(
    public ngxChartsModule: NgxChartsModule
  ){ }


  colorScheme = {
    domain: ['#faf65a', '#abcd67', '#AAAAAA']
  };
  schemeType: string = 'linear';

  onSelect(data): void {
    console.log();
  }

  onActivate(data): void {
    console.log();
  }

  onDeactivate(data): void {
    console.log();
  }


}
