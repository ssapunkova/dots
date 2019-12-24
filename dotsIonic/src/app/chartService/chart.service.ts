import { Injectable } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';


// Chart Service
// Implements sorting the data, displayed in ion-grid

@Injectable()
export class ChartService{

  public chartData;
  public chartWidth;

  public colorScheme = {
      domain: []
  };

  constructor(
    public ngxChartsModule: NgxChartsModule
  ){ }

  async formatChartData(data, columns){

    // console.log(data);

    let formatted = [];
    let registeredCols = [];

    for(var j = 0; j < data.length; j++){
      let record = data[j];

      for(var i = 0; i < record.Values.length; i++){
        let currentCollumn = columns[i].Title;
        let currentColIndex = registeredCols.indexOf(currentCollumn);
        if(currentColIndex < 0){
          formatted.push({
            "name": currentCollumn,
            "series": []
          })
          registeredCols.push(currentCollumn);
          currentColIndex = registeredCols.length - 1;
        }

        formatted[currentColIndex].series.push({
          "name": record.Date,
          "value": parseFloat(record.Values[i])
        })

      }

    }


    this.chartData = formatted;

    // console.log(this.chartData);
    this.chartWidth = this.chartData[0].series.length * 150;


    this.generateColorScheme();

  }

  async generateColorScheme(){
    for(var i = 0; i < 10; i++){
      let hue = Math.floor(Math.random() * (140 - 80) ) + 90;
      let light = Math.floor(Math.random() * (70 - 20) ) + 20;
      this.colorScheme.domain.push("hsl(" + hue + ", 80%, " + light + "%)");
    }
  }



  // onSelect(data): void {
  //   console.log();
  // }
  //
  // onActivate(data): void {
  //   console.log();
  // }
  //
  // onDeactivate(data): void {
  //   console.log();
  // }

}
