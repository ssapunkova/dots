import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from "@angular/router";

import { interval } from 'rxjs';

// Sevrices
import { ConnectToServerService } from '../connectToServerService/connect.service';
import { LoadingService } from '../loadingService/loading.service';
import { ErrorToastAndAlertService } from '../errorToastAndAlertService/errorToastAndAlert.service';
import { DataTableService } from '../dataTableService/dataTable.service';
import { TimeAndDateService } from '../timeAndDateService/timeAndDate.service';
import { ChartService } from '../chartService/chart.service';
import { WorkoutService } from '../workoutService/workout.service';



@Component({
  selector: 'app-workouts',
  templateUrl: './workoutManager.page.html',
  styleUrls: ['./workoutManager.page.scss']
})

@Injectable()
export class WorkoutManagerPage implements OnInit {

  public isNotCancelled = true;

  public sheetExercises = {
    _id: null,                            // sheetId, comes with url
    Title: "",                            // Sheet title
  };

  constructor(
    public http: HttpClient,
    public connectToServerService: ConnectToServerService,
    public loadingService: LoadingService,
    public route: ActivatedRoute,
    public errorToastAndAlertService: ErrorToastAndAlertService,
    public timeAndDateService: TimeAndDateService,
    public alertController: AlertController,
    public modalController: ModalController,
    public workoutService: WorkoutService,
    public dataTableService: DataTableService,
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

      // Dismiss all loading
      this.loadingService.isPageLoading = false;
      this.loadingService.dismissSmallLoading();

    });
  }


  async startWorkout(){
    let that = this;
    let seconds = 5;

    this.countTime = true;

    // Show alert about starting workout
    let alert = await this.alertController.create({
      header: 'Staring workout in ',
      message: seconds,
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
        alert.message = seconds;
        if(seconds == 0){
          setInterval.unsubscribe();
          // Present first exercise
          presentExercise(0);
        }
      }
    });

    await alert.present();

  }

  async presentExercise(index){
    // sheetExercises[index].color = "primary";
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
