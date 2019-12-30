import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from "@angular/router";

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

  public sheetData = {
    _id: null,                            // sheetId, comes with url
    Title: "",                            // Sheet title
    Structure: [],                        // Array of all columns and their goals
    WorkoutRecords: [],                   // Array of json records, raw from database
    WorkoutMonths: [],                    // Array of the available viewing periods (months)
    WorkoutRecordsForSelectedPeriod: []   // Array of json records of all records in selected viewing period
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
    this.sheetData._id = this.route.snapshot.paramMap.get("sheetId");
    // Load sheet data from database
    this.getSheetData();
  }

  async getSheetData(){

    this.workoutService.getWorkoutSheetData(this.sheetData._id).subscribe((data: [any])=> {

      // Get data about all sheets
      this.sheetData = data[0];
      console.log(this.sheetData);

      // Sort records and get workout periods
      let months = [];
      this.timeAndDateService.sortByDate(this.sheetData.WorkoutRecords, "asc");

      // Get array of the months of the records
      // Used to allow the user to select a period ov viewed chart/table
      this.sheetData.WorkoutRecords.forEach((record) => {
        let splitDate = record.Date.split("-")[1] + "." + record.Date.split("-")[0];
        if(months.indexOf(splitDate) < 0){
          months.push(splitDate);
        }
      })
      this.sheetData.WorkoutMonths = months;

      // Dismiss all loading
      this.loadingService.isPageLoading = false;
      this.loadingService.dismissSmallLoading();

    });
  };

}
