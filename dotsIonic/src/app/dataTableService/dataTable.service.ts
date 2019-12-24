import { Injectable } from '@angular/core';

import { TimeAndDateService } from '../timeAndDateService/timeAndDate.service';

// DataTable Service
// Implements sorting the data, displayed in ion-grid

@Injectable()
export class DataTableService{

  public sortedByDate = "asc";

  constructor(
    public timeAndDateService: TimeAndDateService
  ) { }

  // Sort records by date
  // records - workoutSheets[currentSheetIndex].WorkoutRecordsForSelectedPeriod

  async sortByDate(records){

    let that = this;
    let result;

    records.sort(function(a, b){
      let aValue = new Date(a.Date).getTime();
      let bValue = new Date(b.Date).getTime();

      if(that.sortedByDate == "desc"){
        result = aValue - bValue;
      }
      else{
        result = bValue - aValue;
      }
      return result;
    })

    // Set new sortedByDate value
    if(this.sortedByDate == "asc") this.sortedByDate = "desc";
    else this.sortedByDate = "asc";
  }


  // Sort records by values asc or desc
  // col - for accessing "sorted" value ( has field been sorted asc or desc )
  // colIndex - access the correct value in Values array of the records
  // records - workoutSheets[currentSheetIndex].WorkoutRecordsForSelectedPeriod

  async sortCol(col, colIndex, records){

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

}
