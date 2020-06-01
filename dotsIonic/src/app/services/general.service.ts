import { Injectable } from '@angular/core';

import { TimeAndDateService } from './timeAndDate.service';


// General Service
// General functions used everywhere

@Injectable()
export class GeneralService{

  constructor(
    public timeAndDateService: TimeAndDateService
  ) {}

  calculatePercentage(value, goal){

    let percentageOfGoal = 0;
    if(typeof value == "number"){
      percentageOfGoal = Math.round(value * 100 / goal);
    }
    else if(value == null){
      value = 0;
      percentageOfGoal = 0;
    }
    else if(value == true || value == "true") {
      value = 100;
      percentageOfGoal = 100;
    }
    else if(value == false || value == "false") {
      value = 0;
      percentageOfGoal = 0;
    }
    else{
      value = this.timeAndDateService.getSeconds(value);
      goal = this.timeAndDateService.getSeconds(goal);
      percentageOfGoal = Math.round(value * 100 / goal);
      value = new Date(value);
    }
    return percentageOfGoal;
  }

  getType(variable){
    let result = typeof variable;

    // Check for 'true' and 'false' strings
    if(result == 'string'){
      if(variable == 'true' || variable == 'false'){
        result = 'boolean';
      }
    }

    return result;
  }

  countWeeks(start, end){
    return Math.round((new Date(end).getTime() - new Date(start).getTime()) / (1000*60*60*24*7));
  }

}
