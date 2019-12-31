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

  public isNotCancelled = true;
  public currentExerciseIndex = null;

  public inputValue = 0;

  public results = [];

  public sheetExercises = {
    _id: null,                            // sheetId, comes with url
    Title: "",                            // Sheet title
    Structure: []                         // Structure - array of json exercises
  };

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

    this.isNotCancelled = true;

    // Show alert about starting workout
    let alert = await this.alertController.create({
      header: 'Staring workout in ',
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

    let setInterval = interval(1000).subscribe(x => {
      if(this.isNotCancelled){
        seconds -= 1;
        alert.message = "" + seconds;
        if(seconds == 0){
          setInterval.unsubscribe();
          alert.dismiss();
          this.timerService.setInterval();
          // Present first exercise
          this.presentExercise(0);
        }
      }
    });

    await alert.present();

  }


  async presentExercise(index){
    this.currentExerciseIndex = index;
    this.sheetExercises.Structure[index].color = "primary";
  }

  async markAsCompleted(){
    this.results.push(this.inputValue);
    this.presentExercise(this.currentExerciseIndex + 1);
  }

  async terminateWorkout(){
    this.isNotCancelled = false;
    let teminationAlert = await this.alertController.create({
      header: 'You have terminated the workout',
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });

    await teminationAlert.present();
  }

}
