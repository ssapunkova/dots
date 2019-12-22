import { Injectable } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';


// Chart Service
// Implements sorting the data, displayed in ion-grid

@Injectable()
export class ChartService{

  public chartData: [];

  public chartHeight;


  public colorScheme = {
      domain: []
    };

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

  async formatChartData(data, columns){

    console.log(data);

    let formatted = [];

    for(var i = 0; i < data.length; i++){

      let currentSeries = [];

      for(var j = 0; j < data[i].Values.length; j++){
        currentSeries.push({
          "name": columns[j].Title,
          "value": parseFloat(data[i].Values[j]),
          "color": "#ff25" + Math.abs(parseFloat(data[i].Values[j]) - columns[j].Title)
        })
      }

      formatted.push({
        "name": data[i].Date,
        "series": currentSeries
      });
    }

    this.chartData = formatted;

    console.log(this.chartData);
    console.log(formatted);

    this.chartHeight = this.chartData.length * 100;

    for(var i = 0; i < 10; i++){
      let hue = Math.floor(Math.random() * (130 - 90) ) + 90;
      let light = Math.floor(Math.random() * (70 - 25) ) + 25;
      this.colorScheme.domain.push("hsl(" + hue + ", 80%, " + light + "%)");
    }

  }

  constructor(
    public ngxChartsModule: NgxChartsModule
  ){ }

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
