import { Injectable } from '@angular/core';

import { TimeAndDateService } from './timeAndDate.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';


// Chart Service
// Implements formatting and displaying record data in a line chart

@Injectable()
export class ChartService{

  public RECORD_WIDTH = 100;

  public chartData = [];
  public chartWidth;

  public cardColor = "#eeeeee";

  // Chart colors, generated by generateColorScheme()
  public colorScheme = {
      domain: []
  };

  constructor(
    public ngxChartsModule: NgxChartsModule,
    public timeAndDateService: TimeAndDateService
  ){ }

  // Takes records and formarts it for ngx line chart
  // input - an array of json objects, each has a date and values for every column
  // output - an array of json objects, each representing values of a column for every date (series)

  async formatChartData(data, columns){

    let formatted = [];
    let registeredCols = [];

    for(var j = 0; j < data.length; j++){
      let record = data[j];

      for(var i = 0; i < record.Values.length; i++){
        let date = await this.timeAndDateService.formatDate(record.Date);
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
        let value = record.Values[i];
        if(typeof value == "number"){
          value = parseFloat(record.Values[i]);
        }
        else if(record.Values[i] == true) {
          value = 10;
        }
        else if(record.Values[i] == false) value = 0;
        else{
          console.log(record.Values[i], new Date(this.timeAndDateService.getSeconds(record.Values[i])));
          value = new Date(this.timeAndDateService.getSeconds(record.Values[i]));
        }
        formatted[currentColIndex].series.push({
          "name": date,
          "value": value,
          "tooltipText": record.Values[i]
        })
      }

    }

    this.chartData = formatted;
    console.log(this.chartData);

    // Calculate chart's width based on the number of dates shown
    this.chartWidth = this.chartData[0].series.length * this.RECORD_WIDTH;

    this.generateColorScheme(columns.length);

  }

  // Choose random green colors for chart's color scheme
  async generateColorScheme(n){
    let step = 200 / n;
    let hue = 20;
    for(var i = 0; i < n; i++){
      // Random green hue and light
      hue += step;
      let light = Math.floor(Math.random() * (70 - 40) ) + 40;
      this.colorScheme.domain.push("hsl(" + hue + ", 80%, " + light + "%)");
    }
  }


}
