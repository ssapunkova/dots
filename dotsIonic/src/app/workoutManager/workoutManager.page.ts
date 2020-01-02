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
    BreakSecondsLeft: 5,                  // Seconds left before next exercise
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
    public timeAndDateService: TimeAndDateService
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
  }


  async startWorkout(){
    let that = this;
    let seconds = 5;

    this.controls.IsNotCancelled = true;

    // Show alert about starting workout
    let alert = await this.alertController.create({
      header: 'Starting workout in ',
      message: "" + seconds,
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


    this.timerService.setCountdown(2,
      function(seconds){
        alert.message = "" + seconds;
      },
      function(){
        alert.dismiss();
        that.timerService.setTimer();
        that.presentNextExercise();
      }
    )
    // });

    await alert.present();

  }

  async pauseWorkout(){
    console.log("pause")
    this.controls.IsExerciseRunning = false;
    this.controls.IsPaused = true;
    console.log(this.controls.IsABreak)
    if(this.controls.IsABreak == false){
      this.timerService.pauseTimer();
    }
  }

  async playWorkout(){
    this.controls.IsPaused = false;
    console.log(this.controls.IsABreak);
    if(this.controls.IsABreak == false){
      this.timerService.playTimer();
      this.controls.IsExerciseRunning = true;
    }
  }

  async presentNextExercise(){
    console.log(this.time);
    this.controls.IsABreak = false;
    this.controls.IsExerciseRunning = true;
    this.current.ExerciseStartedAt = this.timerService.timePassed();
    if(this.current.ExerciseIndex == null){
      this.current.ExerciseIndex = 0;
    }
    else{
      if(this.current.ExerciseIndex < this.exerciseNumber - 1){
        this.current.ExerciseIndex++;
      }
    }
    this.current.InputValue = this.sheetExercises.Structure[this.current.ExerciseIndex].Goal;
  }

  async markAsCompleted(){
    let that = this;
    this.timerService.pauseTimer();

    this.results.push(this.current.InputValue);
    if(this.time.length == 0){
      this.time.push(this.timerService.timePassed());
    }
    else{
      this.time.push(this.timerService.timePassed() - this.current.ExerciseStartedAt);
    }

    this.controls.IsExerciseRunning = false;

    if(!this.controls.IsFinished){
      this.controls.IsABreak = true;
      this.current.BreakSecondsLeft = 5;
      this.timerService.setCountdown(5,
        function(seconds){
          that.current.BreakSecondsLeft = seconds;
        },
        function(){
          that.controls.IsABreak = false;
          if(that.controls.IsPaused == false) {
            that.controls.IsExerciseRunning = true;
            that.timerService.playTimer();
          }
          that.presentNextExercise();
        }
      )
    }
  }

  async terminateWorkout(){
    let that = this;
    let teminationAlert = await this.alertController.create({
      header: 'Terminate workout?',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            if(that.current.ExerciseIndex != null){
              that.current.ExerciseIndex = null;
              that.timerService.pauseTimer();
            }
            else{
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

    this.markAsCompleted();

    this.timerService.pauseTimer();
    console.log("FINISHED");
    console.log(this.results);
    console.log(this.time);
  }

}
