import { Injectable } from '@angular/core';

import { TimeAndDateService } from './timeAndDate.service';


// Chart Service
// Implements formatting and displaying record data in a line chart

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
    return typeof variable;
  }

}
