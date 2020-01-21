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
  public legendData = ["a"];
  public legendColors;
  public chartWidth;

  public cardColor = "#eeeeee";

  // Chart colors, generated by generateColorSchema()
  public colorScheme = {
      domain: []
  };

  constructor(
    public ngxChartsModule: NgxChartsModule,
    public timeAndDateService: TimeAndDateService
  ){ }

  // Takes records and formarts it for ngx line chart
  // input - an array of json objects, each has a date and values for every param
  // output - an array of json objects, each representing values of a param for every date (series)

  async formatChartData(data, params, goals){

    let formatted = [];
    let registeredParams = [];

    for(var j = 0; j < data.length; j++){
      let record = data[j];

      for(var i = 0; i < record.Values.length; i++){
        let date = await this.timeAndDateService.formatDate(record.Date);
        let currentParam = params[i];

        let currentParamIndex = registeredParams.indexOf(currentParam);
        if(currentParamIndex < 0){
          this.chartData.push({
            "name": currentParam.Title,
            "series": []
          })
          registeredParams.push(currentParam);
          currentParamIndex = registeredParams.length - 1;
        }

        let value = record.Values[i];
        let percentageOfGoal = 0;
        if(typeof value == "number"){
          value = parseFloat(record.Values[i]);
          percentageOfGoal = Math.round(value * 100 / goals[i]);
        }
        else if(value == null){
          value = 0;
        }
        else if(value == true) {
          value = 100;
          percentageOfGoal = 100;
        }
        else if(value == false) {
          value = 0;
          percentageOfGoal = 0;
        }
        else{
          value = this.timeAndDateService.getSeconds(record.Values[i]);
          let goal = this.timeAndDateService.getSeconds(currentParam.Goal);
          percentageOfGoal = Math.round(value * 100 / goal);
          value = new Date(value);
        }


        this.chartData[currentParamIndex].series.push({
          "name": date,
          "value": percentageOfGoal,
          "realValue": record.Values[i],
          "percentageOfGoal": percentageOfGoal
        })
      }

    }

    this.legendColors = ["#fcaaab", "#bcafaf"]

    // Calculate chart's width based on the number of dates shown
    this.chartWidth = this.chartData[0].series.length * this.RECORD_WIDTH;

    this.generateColorScheme(params.length);

    console.log(goals)
    console.log(this);

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
