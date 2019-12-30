import { Injectable } from '@angular/core';

import { TimeAndDateService } from './timeAndDate.service';

import { interval } from 'rxjs';

// Chart Service
// Implements formatting and displaying record data in a line chart

@Injectable()
export class TimerService{

  public startDate = null;
  public currentDate = null;

  async setInterval(){
    this.startDate = new Date();
    this.currentDate = new Date();
    let setTimer = interval(1000).subscribe(x => {
      this.currentDate = new Date();

      console.log(this.startDate, this.currentDate)
    });
  }

}
