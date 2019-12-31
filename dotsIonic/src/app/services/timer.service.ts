import { Injectable } from '@angular/core';

import { TimeAndDateService } from './timeAndDate.service';

import { interval } from 'rxjs';

// Chart Service
// Implements formatting and displaying record data in a line chart

@Injectable()
export class TimerService{

  public startDate = null;
  public currentDate = null;

  public timer;

  async timerFunc(){
    console.log(this.currentDate);
    this.currentDate++;

  }

  async setTimer(){
    this.startDate = new Date();
    this.currentDate = new Date();
    this.timer = interval(1000).subscribe(x => {
      this.timerFunc()
    });
  }

  async pauseTimer(){
    this.timer.unsubscribe();
  }

  async playTimer(){
    this.timer = interval(1000).subscribe(x => {
      this.timerFunc()
    });
  }

  async setCountdown(seconds, whileFunc, afterFunc){
    let secondsLeft = seconds;
    this.timer = interval(1000).subscribe(x => {
      if(secondsLeft > 0){
        // Decrement secondsLeft and execute some actions while the countdown is running
        secondsLeft--;
        whileFunc(secondsLeft);
      }
      else{
        // Execute actions after the timer has stopped
        this.timer.unsubscribe();
        afterFunc();
      }
    });
  }

  async stopCountdown(){
    this.timer.unsubscribe();
  }

}
