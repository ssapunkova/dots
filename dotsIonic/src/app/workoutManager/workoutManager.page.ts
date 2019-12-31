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



@Component({
  selector: 'app-workouts',
  templateUrl: './workoutManager.page.html',
  styleUrls: ['./workoutManager.page.scss']
})

@Injectable()
export class WorkoutManagerPage implements OnInit {

  public controls = {                     // Control pausing, timer
    IsNotCancelled: true,                 // Is workout not cancelled
    IsPaused: false,                      // Is workout on pause
    IsABreak: false
  }

  public sheetExercises = {
    _id: null,                            // sheetId, comes with url
    Title: "",                            // Sheet title
    Structure: []                         // Structure - array of json exercises
  };

  public current = {                      // Save temporary values for current state
    InputValue: 0,                       // User's results for current exercise
    ExerciseIndex: null,                 // exercise index
    BreakSecondsLeft: 5
  }

  public results = [];

  constructor(
    public loadingService: LoadingService,
    public route: ActivatedRoute,
    public errorToastAndAlertService: ErrorToastAndAlertService,
    public timerService: TimerService,
    public alertController: AlertController,
    public modalController: ModalController,
    public workoutService: WorkoutService,
    public dataTableService: DataTableService
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
        that.presentExercise(0);
      }
    )
    // });

    await alert.present();

  }

  async pauseWorkout(){
    console.log("pause")
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
    }
  }

  async presentExercise(index){
    this.controls.IsABreak = false;
    this.current.ExerciseIndex = index;
  }

  async markAsCompleted(){
    let that = this;
    this.results.push(this.current.InputValue);
    this.timerService.pauseTimer();
    this.controls.IsABreak = true;

    this.sheetExercises.Structure[this.current.ExerciseIndex].Results = this.current.InputValue;

    that.current.BreakSecondsLeft = 5;
    this.timerService.setCountdown(5,
      function(seconds){
        that.current.BreakSecondsLeft = "" + seconds;
      },
      function(){
        that.controls.IsABreak = false;
        if(that.controls.IsPaused == false) that.timerService.playTimer();
        that.presentExercise(that.current.ExerciseIndex + 1);
      }
    )
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
            that.presentExercise(0);
          }
        }
      ]
    });

    await teminationAlert.present();
  }

}
