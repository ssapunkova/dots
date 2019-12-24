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

}
