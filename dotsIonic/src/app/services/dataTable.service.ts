import { Injectable } from '@angular/core';

import { TimeAndDateService } from './timeAndDate.service';
import { ChartService } from '../services/chart.service';

// DataTable Service
// Implements sorting the data, displayed in ion-grid

@Injectable()
export class DataTableService{

  public sortedByDate = "asc";

  public allRecords = [];
  public showingRecords = [];
  public showingMonths = [];
  public structure = [];

  constructor(
    public timeAndDateService: TimeAndDateService,
    public chartService: ChartService
  ) { }

  // Sort records by date
  // records - workoutSheets[currentSheetIndex].WorkoutRecordsForSelectedPeriod
  async sortByDate(){

    let that = this;
    let result;

    // Sort records using TimeAndDateService
    // Set new sortedByDate value
    if(that.sortedByDate == "asc"){
      this.timeAndDateService.sortByDate(this.showingRecords, "desc");
      this.sortedByDate = "desc";
    }
    else{
      this.timeAndDateService.sortByDate(this.showingRecords, "asc");
      this.sortedByDate = "asc";
    }

  }

  // Sort records by values asc or desc
  // col - for accessing "sorted" value ( has field been sorted asc or desc )
  // colIndex - access the correct value in Values array of the records
  // records - workoutSheets[currentSheetIndex].WorkoutRecordsForSelectedPeriod

  async sortCol(col, colIndex){

    let that = this;
    let result;

    // If it's sorted asc, sort it desc ( b - a )
    // else, if it's sorted desc or hasn't been sorted yet, sort asc ( a - b )
    this.showingRecords.sort(function(a, b){
      let aValue = a.Values[colIndex];
      let bValue = b.Values[colIndex];

      // If value is time (hh:mm:ss format)
      // Calculate duration in seconds using timeConverter service
      if(col.Type == "Time"){
        aValue = that.timeAndDateService.getSeconds(aValue);
        bValue = that.timeAndDateService.getSeconds(bValue);
      }

      // Sort asc/desc
      if(col.sorted == "asc"){
        result = (bValue - aValue);
      }
      else{
        result = (aValue - bValue);
      }
      return result;
    });

    // Set new values for col.sorted for further sorting
    if(col.sorted == "asc"){
      col.sorted = "desc";
    }
    else{
      col.sorted = "asc";
    }
  }

  // Set viewing period of chart/table
  // can be triggered by ion-select ( case 1 ) or by code ( case 2 )
  async setPeriod($event){

    if($event.target != undefined){
      // case 1, use selected periods from ion-select
      this.showPeriods = $event.target.value;
    }
    else{
      // case 2, set showPeriods to the latest
      let lastRecordDate = this.allRecords[0].Date.split("-");
      this.showPeriods = [lastRecordDate[1] + "." + lastRecordDate[0]];
      console.log(this.showPeriods)
    }

    // Filter which records to show and sort them by date
    this.showingRecords = this.allRecords.filter((record) => this.showPeriods.indexOf(record.Date.split("-")[1] + "." + record.Date.split("-")[0]) > -1);


    // Format data for chart
    this.chartService.formatChartData(this.showingRecords, this.structure);

  }

  async getShowingMonths(){
    // Array of months - Used to allow the user to select a period ov viewed chart/table
    let months = [];
    this.allRecords.forEach((record, i) => {
      record.index = i;
      let splitDate = record.Date.split("-")[1] + "." + record.Date.split("-")[0];
      if(months.indexOf(splitDate) < 0){
        months.push(splitDate);
      }
    })
    this.showingMonths = months;
  }

}
