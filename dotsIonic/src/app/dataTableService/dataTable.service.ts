import { Injectable } from '@angular/core';

import { TimeConverterService } from '../timeConverterService/timeConverter.service';

// DataTable Service
// Implements sorting the data, displayed in ion-grid

@Injectable()
export class DataTableService{

  public sortedByDate = "asc";

  constructor(
    public timeConverterService: TimeConverterService
  ) { }

  // Sort records by date
  // records - workoutSheets[currentSheetIndex].WorkoutRecords

  async sortByDate(records){

    let that = this;
    let result;

    // sort months
    records.sort(function(a, b){
      let aValue = new Date(a.Year + "-" + a.Month + "-01").getTime();
      let bValue = new Date(b.Year + "-" + b.Month + "-01").getTime();

      if(that.sortedByDate == "desc"){
        result = aValue - bValue;
      }
      else{
        result = bValue - aValue;
      }
      return result;
    })
    // substract b's date from a's date to compare them
    // records.sort(function(a, b){
    //   let aValue = new Date(a.Date).getTime();
    //   let bValue = new Date(b.Date).getTime();
    //
    //   if(that.sortedByDate == "desc"){
    //     result = bValue - aValue;
    //   }
    //   else{
    //     result = aValue - bValue;
    //   }
    //   return result;
    // });

    // Set new sortedByDate value
    if(this.sortedByDate == "asc") this.sortedByDate = "desc";
    else this.sortedByDate = "asc";
  }


  // Sort records by values asc or desc
  // col - for accessing "sorted" value ( has field been sorted asc or desc )
  // colIndex - access the correct value in Values array of the records
  // records - workoutSheets[currentSheetIndex].WorkoutRecords

  async sortCol(col, colIndex, records){
    console.log(col, colIndex);
    let that = this;
    let result;

    // If it's sorted asc, sort it desc ( b - a )
    // else, if it's sorted desc or hasn't been sorted yet, sort asc ( a - b )
    records.sort(function(a, b){
      let aValue = a.Values[colIndex];
      let bValue = b.Values[colIndex];

      // If value is time (hh:mm:ss format)
      // Calculate duration in seconds using timeConverter service
      if(col.Type == "Time"){
        aValue = that.timeConverterService.getSeconds(aValue);
        bValue = that.timeConverterService.getSeconds(bValue);
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

}
