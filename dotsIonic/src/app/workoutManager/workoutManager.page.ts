import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from "@angular/router";

import { interval } from 'rxjs';

// Services
import { LoadingService } from '../services/loading.service';
import { ErrorToastAndAlertService } from '../services/errorToastAndAlert.service';
import { DataTableService } from '../services/dataTable.service';
import { TimerService } from '../services/timer.service';
import { WorkoutService } from '../services/workout.service';
import { ChartService } from '../services/chart.service';
import { TimeAndDateService } from '../services/timeAndDate.service';

@Component({
  selector: 'app-workouts',
  templateUrl: './workoutManager.page.html',
  styleUrls: ['./workoutManager.page.scss']
})

@Injectable()
export class WorkoutManagerPage implements OnInit {

  public controls = {                     // Control pausing, timer
    IsNotCancelled: true,                 // Is workout not cancelled
    IsExerciseRunning: false,             // Not paused, not during a break, not finished -> an exercise is in process
    IsPaused: false,                      // Is workout on pause
    IsABreak: false,                      // Is it a break between exercises
    IsFinished: false                     // Has the workout finished
  }

  public sheetExercises = {
    _id: null,                            // sheetId, comes with url
    Title: "",                            // Sheet title
    Structure: []                         // Structure - array of json exercises
  };

  public current = {                      // Save temporary values for current state
    InputValue: 0,                        // User's results for current exercise
    ExerciseIndex: null,                  // Exercise index
    BreakSecondsLeft: 2,                  // Seconds left before next exercise
    ExerciseStartedAt: 0                  // Record start time of exercise ( needed for calculating exercise duration )
  }

  public exerciseNumber = 0;              // Exercise count
  public results = [];                    // User's results on each exercise
  public time = [];                       // How much time has each exercise taken


  constructor(
    public loadingService: LoadingService,
    public route: ActivatedRoute,
    public errorToastAndAlertService: ErrorToastAndAlertService,
    public timerService: TimerService,
    public alertController: AlertController,
    public modalController: ModalController,
    public workoutService: WorkoutService,
    public dataTableService: DataTableService,
    public timeAndDateService: TimeAndDateService,
    public chartService: ChartService
  ) { };

  ngOnInit() {
    // Get sheetId
    this.sheetExercises._id = this.route.snapshot.paramMap.get("sheetId");
    // Load sheet data from database
    this.getsheetExercises();
  }

  async getsheetExercises(){

    this.workoutService.getSheetExercises(this.sheetExercises._id).subscribe((data: [any])=> {

      // Get data about all sheets
      this.sheetExercises = data[0];
      console.log(this.sheetExercises);

      this.exerciseNumber = this.sheetExercises.Structure.length;

      // Dismiss all loading
      this.loadingService.isPageLoading = false;
      this.loadingService.dismissSmallLoading();

    });

    // Get average time for exercises
    this.workoutService.getExerciseTimes(this.sheetExercises._id).subscribe((records: any) => {
      // Find sum of all records
      let sum = 0;

      let recordsNum = records.length;
      for(var i = 0; i < recordsNum; i++){
        sum += records[i].Time * 1000;
      }
      // Divide value by current records number
      this.averageTime = sum / recordsNum;

      console.log(this.sumTime, this.averageTime);

      // this.chartService.formatTimeChartData(average);
    });
  }


  async startWorkout(){

    // IsNotCancelled means the user hasn't clicked Terminate Workout button
    this.controls.IsNotCancelled = true;
    let that = this;
    let secondsLeft = 2;
    // Show alert about starting workout
    let alert = await this.alertController.create({
      header: 'Starting workout in ',
      message: "" + secondsLeft,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel workout',
          handler: () => {
            that.terminateWorkout();
          }
        }
      ]
    });

    // Set countdown for secondsLeft
    this.timerService.setCountdown(secondsLeft,
      function(secondsLeft){
        alert.message = "" + secondsLeft;
      },
      function(){
        alert.dismiss();
        // Set timer for workout and present the first exercise
        that.timerService.setTimer();
        that.presentNextExercise();
      }
    )

    await alert.present();

  }

  async presentNextExercise(){

    // Finish break between exercises, resume exercise running
    this.controls.IsABreak = false;
    this.controls.IsExerciseRunning = true;
    // Mark the time of starting the exercise
    this.current.ExerciseStartedAt = this.timerService.timePassed();
    // If workout has just started, present fist exercise
    if(this.current.ExerciseIndex == null){
      this.current.ExerciseIndex = 0;
    }
    else{
      // If the current it's not the last exercise, present the next one
      if(this.current.ExerciseIndex < this.exerciseNumber - 1){
        this.current.ExerciseIndex++;
      }
    }
    // Set the user's result field to the goal
    this.current.InputValue = this.sheetExercises.Structure[this.current.ExerciseIndex].Goal;
  }

  async markAsCompleted(){
    // Pause timer for the break and push user's value to results array
    this.timerService.pauseTimer();
    this.controls.IsExerciseRunning = false;
    this.results.push(this.current.InputValue);

    let that = this;
    // If there are more exercises to present
    if(!this.controls.IsFinished){
      // Make a break
      this.controls.IsABreak = true;
      this.current.BreakSecondsLeft = 2;
      this.timerService.setCountdown(this.current.BreakSecondsLeft,
        function(seconds){
          that.current.BreakSecondsLeft = seconds;
        },
        function(){
          // Finsish the break and, if workout is not paused, resume timer
          that.controls.IsABreak = false;
          if(that.controls.IsPaused == false) {
            that.controls.IsExerciseRunning = true;
            that.timerService.playTimer();
          }
          // Present next exercise
          that.presentNextExercise();
        }
      )
    }
  }

  async pauseWorkout(){
    this.controls.IsExerciseRunning = false;
    this.controls.IsPaused = true;
    // Pause the timer if it's not a break
    if(this.controls.IsABreak == false){
      this.timerService.pauseTimer();
    }
  }

  async playWorkout(){
    this.controls.IsPaused = false;
    // Play timer if it's not a break
    if(this.controls.IsABreak == false){
      this.timerService.playTimer();
      this.controls.IsExerciseRunning = true;
    }
  }

  async terminateWorkout(){
    let that = this;
    // Ask user if they want to terminate the workout
    let teminationAlert = await this.alertController.create({
      header: 'Terminate workout?',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            // If the workout is in proccess already, stop timer and reset ExerciseIndex
            if(that.current.ExerciseIndex != null){
              that.current.ExerciseIndex = null;
              that.timerService.pauseTimer();
            }
            else{
              // If it's still the Starting workout in... countdown, stop the countdown
              that.timerService.stopCountdown();
            }
          }
        },
        {
          text: "Cancel",
          handler: () => {
            that.presentNextExercise();
          }
        }
      ]
    });

    await teminationAlert.present();
  }

  async finish(){
    this.controls.IsPaused = false;
    this.controls.IsFinished = true;

    // Mark last exercise's result and pause timer
    this.markAsCompleted();
    this.timerService.pauseTimer();

    this.time = this.timerService.timePassed() / 1000;

    console.log("FINISHED");
    console.log(this.results);
    console.log(this.time);

    // Add record to database
    let record = {
      SheetId: this.sheetExercises._id,
      RecordId: null,
      Date: await this.timeAndDateService.getDate("today"),
      Values: this.results,
      Columns: this.sheetExercises.Structure.map((col) => col._id),
      Time: this.time
    }

    this.workoutService.addRecord(record).subscribe((data: any) => {
      console.log(data);
    });

  }

}
