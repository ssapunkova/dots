import { Injectable } from '@angular/core';

// TimeAndDate Service
// Implements converting time formats

@Injectable()
export class TimeAndDateService{

  constructor(
  ) { }

  // Converts time format hh:mm:ss to seconds
  // Example: 02:10 -> 130

  getSeconds(string){
    let seconds = 0;
    let split = string.split(":");
    let multiplier = 1;
    for(let i = split.length - 1; i >= 0; i--){
      seconds += multiplier * parseInt(split[i]);
      multiplier *= 60;
    }
    return seconds;
  }

  async formatDate(date){
    let splitDate = date.split("-");
    return splitDate[2] + "." + splitDate[1];
  }

  async sortByDate(array, direction){

    let that = this;
    let result;

    array.sort(function(a, b){
      let aValue = new Date(a.Date).getTime();
      let bValue = new Date(b.Date).getTime();

      if(direction == "desc"){
        result = aValue - bValue;
      }
      else{
        result = bValue - aValue;
      }
      return result;
    })

  }

}
