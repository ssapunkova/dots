import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, MenuController } from '@ionic/angular';
import { ActivatedRoute } from "@angular/router";

import { interval } from 'rxjs';

// Services
import { TranslateService } from '@ngx-translate/core';

import { LoadingService } from '../services/loading.service';
import { GeneralService } from '../services/general.service';
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
    IsDataLoaded: false,
    IsNotCancelled: true,                 // Is workout not cancelled
    IsExerciseRunning: false,             // Not paused, not during a break, not finished -> an exercise is in process
    IsPaused: false,                      // Is workout on pause
    IsABreak: false,                      // Is it a break between exercises
    IsFinished: false                     // Has the workout finished
  }

  public sheetData = {
    _id: null,                            // sheetId, comes with url
    Title: "",                            // Sheet title
    Params: [],                           // Params - array of json exercises
    RecordsNum: 0,                        // Number of records
    Color: null                           // Sheet color (used in page)
  };

  public current = {                      // Save temporary values for current state
    InputValue: 0,                        // User's results for current exercise
    ExerciseIndex: null,                  // Exercise index
    BreakSecondsLeft: 2,                  // Seconds left before next exercise
    ExerciseStartedAt: 0                  // Record start time of exercise ( needed for calculating exercise duration )
  }

  public resultsSum = 0;                  // Sum of percentages to show goal reach percentage in totals

  public exerciseNumber = 0;              // Exercise count
  public results = [];                    // User's results on each exercise
  public time = 0;                        // Duration of current workout

  public extraResults = 0;                // How many goals has the user overflowed

  public averageTime = 0;                 // This workout average duration
  public hourglassAnimationTime;

  constructor(
    public commonModule: CommonModule,
    public menuController: MenuController,
    public loadingService: LoadingService,
    public route: ActivatedRoute,
    public translate: TranslateService,
    public generalService: GeneralService,
    public errorToastAndAlertService: ErrorToastAndAlertService,
    public timerService: TimerService,
    public alertController: AlertController,
    public workoutService: WorkoutService,
    public dataTableService: DataTableService,
    public timeAndDateService: TimeAndDateService,
    public chartService: ChartService
  ) { };

  
  ionViewWillEnter() {
    this.menuController.enable(false);
  }


  ngOnInit() {
    // Get sheetId

    this.loadingService.showPageLoading();

    this.sheetData._id = this.route.snapshot.paramMap.get("sheetId");
    // Load sheet data from database
    this.getSheetExercises();
  }

  async getSheetExercises(){

    this.workoutService.getSheetExercises(this.sheetData._id).subscribe( async (data: [any])=> {

      console.log(this.sheetData, data[0])
      // Get data about this sheet
      this.sheetData.Title = data[0].Title;
      this.sheetData = data[0];
      console.log(this.sheetData);

      this.exerciseNumber = this.sheetData.Params.length;

    });

    // Get average time for exercises
    this.workoutService.getExerciseTimes(this.sheetData._id).subscribe( async (records: any) => {
      if(records.length > 0){
        // Find sum of all records
        let sum = 0;

        this.sheetData.RecordsNum = records.length;
        for(var i = 0; i < this.sheetData.RecordsNum; i++){
          sum += records[i].Time * 1000;
        }
        // Divide value by current records number
        this.averageTime = sum / this.sheetData.RecordsNum;

        this.hourglassAnimationTime = this.averageTime / 1000 + "s";

        console.log(this.averageTime);

        this.controls.IsDataLoaded = true;

      }
    },
    error => {
      this.errorToastAndAlertService.showErrorAlert("Oups");
    });

    // this.startWorkout();

    

    this.loadingService.hidePageLoading();

  }


  async startWorkout(){

    // IsNotCancelled means the user hasn't clicked Terminate Workout button
    this.controls.IsNotCancelled = true;
    let that = this;
    let secondsLeft = 5;

    // Show alert about starting workout
    let alert = await this.alertController.create({
      header: that.translate.instant("StartingWorkoutIn"),
      message: "" + secondsLeft,
      backdropDismiss: false,
      buttons: [
        {
          text: this.translate.instant("Cancel"),
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
    this.current.InputValue = this.sheetData.Params[this.current.ExerciseIndex].Goal;
  }

  async markAsCompleted(){
    // Pause timer for the break and push user's value to results array
    this.timerService.pauseTimer();
    this.controls.IsExerciseRunning = false;

    // Manage bool results
    if(this.current.InputValue.toString() == "true") {
      this.results.push(true);
      this.resultsSum += 100;
    }
    else if(this.current.InputValue.toString() == "false") {
      this.results.push(false);
    }
    else {
      this.results.push(this.current.InputValue);
      let percentageOfGoals = this.generalService.calculatePercentage(this.current.InputValue, this.sheetData.Params[this.current.ExerciseIndex].Goal);
      this.resultsSum += percentageOfGoals;
      if(percentageOfGoals > 100){
        this.extraResults++;
      }
    }

    console.log(this.resultsSum);

    let that = this;

    // If there are more exercises to present
    if(!this.controls.IsFinished){
      // Make a break
      this.controls.IsABreak = true;
      this.current.BreakSecondsLeft = 10;

      let messagePt1 = this.sheetData.Params[this.current.ExerciseIndex + 1].Title 
      + "<br>"  + this.translate.instant("in") + "<br>"
      + "<h1>";

      let messagePt2 = "</h1>";
      
      // Show alert about next exercise workout
      let alert = await this.alertController.create({
        header: that.translate.instant("NextExercise"),
        message: messagePt1 + that.current.BreakSecondsLeft + messagePt2,
        backdropDismiss: false,
        buttons: [
          {
            text: this.translate.instant("Pause"),
            handler: () => {
              that.pauseWorkout();
            }
          }
        ]
      });


      this.timerService.setCountdown(this.current.BreakSecondsLeft,
        function(seconds){
          that.current.BreakSecondsLeft = seconds;
          alert.message = messagePt1 + seconds + messagePt2;
        },
        function(){
          alert.dismiss();
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

      await alert.present();
      
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
      header: that.translate.instant("TerminateWorkoutQuestion"),
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
          text: that.translate.instant("Cancel"),
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

    console.log(this.timerService.timePassed());

    this.time = this.timerService.timePassed() / 1000;

    console.log("FINISHED");
    console.log(this.results);
    console.log(this.time);


    // Add record to database
    let record = {
      SheetId: this.sheetData._id,
      RecordId: null,
      Date: await this.timeAndDateService.getDate("today"),
      Values: this.results,
      Params: this.sheetData.Params.map((col) => col._id),
      Time: this.time
    }

    this.workoutService.addRecord(record).subscribe( async (data: any) => {
      console.log(data);
    });

  }

}
