import { Injectable } from '@angular/core';

import { TimeAndDateService } from './timeAndDate.service';

import { interval } from 'rxjs';

// Timer Service
// Implements setting timers and countdowns

@Injectable()
export class TimerService{

  public startDate = null;
  public currentDate = null;

  public timer;

  // Sets timer
  async setTimer(){
    this.startDate = new Date();
    this.currentDate = new Date();
    this.playTimer();
  }

  // Increments seconds
  async timerFunc(){
    console.log(this.currentDate);
    this.currentDate++;

  }

  // Pauses timer
  async pauseTimer(){
    this.timer.unsubscribe();
  }

  // Start/restart the timer
  async playTimer(){
    this.timer = interval(1000).subscribe(x => {
      this.timerFunc()
    });
  }

  // Set a countdown in seconds
  // seconds - how many seconds will the countdown last
  // whileFunc - function that is be called every second
  // afterFunc - function that is called after the countdown ends
  async setCountdown(seconds, whileFunc, afterFunc){
    let secondsLeft = seconds;
    this.timer = interval(1000).subscribe(x => {
      if(secondsLeft > 0){
        secondsLeft--;
        whileFunc(secondsLeft);
      }
      else{
        this.timer.unsubscribe();
        afterFunc();
      }
    });
  }

  // Stop the countdown
  async stopCountdown(){
    this.timer.unsubscribe();
  }

}
