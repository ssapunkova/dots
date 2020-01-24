import { Injectable } from '@angular/core';

import { GeneralService } from './general.service';
import { TimeAndDateService } from './timeAndDate.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';


// Chart Service
// Implements formatting and displaying record data in a line chart

@Injectable()
export class ChartService{

  public RECORD_WIDTH = 100;

  public chartData = [];
  public legendColors;
  public chartWidth;

  // Chart colors, generated by generateColorSchema()
  public colorScheme = {
      domain: []
  };

  constructor(
    public ngxChartsModule: NgxChartsModule,
    public generalService: GeneralService,
    public timeAndDateService: TimeAndDateService
  ){ }

  // Takes records and formarts it for ngx line chart
  // data - records
  // params - param data
  // goals - goals fro each param (params' default goals merged with user's custom ones)
  // input - an array of json objects, each has a date and values for every param
  // output - an array of json objects, each representing values of a param for every date (series)

  async formatChartData(data, params, goals){

    this.chartData = [];

    let formatted = [];
    let registeredParams = [];

    // if no user custom goals
    if(goals == null){
      goals = [];
      for(var i = 0; i < params.length; i++){
        goals.push(params[i].Goal);
      }
    }

    // Go through each record
    for(var j = 0; j < data.length; j++){
      let record = data[j];

      // Go through every param of current record, get it's value and percentageOfGoal
      for(var i = 0; i < record.Values.length; i++){
        let currentParam = params[i];
        let date = await this.timeAndDateService.formatDate(record.Date);

        // if it's a new, unregistered yet param
        let currentParamIndex = registeredParams.indexOf(currentParam);
        if(currentParamIndex < 0){
          this.chartData.push({
            "name": currentParam.Title,
            "series": []
          })
          registeredParams.push(currentParam);
          currentParamIndex = registeredParams.length - 1;
        }

        // push values to current param series
        this.chartData[currentParamIndex].series.push({
          "name": date,
          "value": record.PercentageOfGoal[i],
          "realValue": record.Values[i],
          "percentageOfGoal": record.PercentageOfGoal[i]
        })
      }

    }

    // Calculate chart's width based on the number of dates shown
    this.chartWidth = this.chartData[0].series.length * this.RECORD_WIDTH;

    this.generateColorScheme(params.length);

    console.log("***ChartService", this);

  }

  // Choose random colors for chart's color scheme
  async generateColorScheme(n){
    // Wanted colors with hue in range (20; 220)
    // so step = 200 / number of records
    let step = 200 / n;
    let hue = 20;
    for(var i = 0; i < n; i++){
      hue += step;
      // Random light
      let light = Math.floor(Math.random() * (70 - 40) ) + 40;
      this.colorScheme.domain.push("hsl(" + hue + ", 80%, " + light + "%)");
    }
  }


}
