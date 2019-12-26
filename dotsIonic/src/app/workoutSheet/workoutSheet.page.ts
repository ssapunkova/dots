import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from "@angular/router";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';

// Sevrices
import { ConnectToServerService } from '../connectToServerService/connect.service';
import { LoadingService } from '../loadingService/loading.service';
import { ToastService } from '../toastService/toast.service';
import { DataTableService } from '../dataTableService/dataTable.service';
import { TimeAndDateService } from '../timeAndDateService/timeAndDate.service';
import { ChartService } from '../chartService/chart.service';
import { WorkoutSheetService } from './workoutSheet.service';

import { NewWorkoutRecordPage } from './newWorkoutRecord/newWorkoutRecord.page';


@Component({
  selector: 'app-workouts',
  templateUrl: './workoutSheet.page.html',
  styleUrls: ['./workoutSheet.page.scss']
})

@Injectable()
export class WorkoutSheetPage implements OnInit {

  public sheetData = {
    _id: null,
    Title: "",
    Structure: [],
    WorkoutRecords: []
  };

  public showMode = 'chart';
  public showPeriods = [];

  public isButtonDisabled = {
    addRecord: true
  }

  public smallLoading;

  constructor(
    public http: HttpClient,
    public connectToServerService: ConnectToServerService,
    public loadingService: LoadingService,
    public route: ActivatedRoute,
    public toastService: ToastService,
    public timeAndDateService: TimeAndDateService,
    public alertController: AlertController,
    public modalController: ModalController,
    public workoutSheetService: WorkoutSheetService,
    public dataTableService: DataTableService,
    public chartService: ChartService,
    public ngxChartsModule: NgxChartsModule
  ) { };

  ngOnInit() {
    // Get sheetId
    this.sheetData._id = this.route.snapshot.paramMap.get("sheetId");
    console.log(this.sheetData._id);
    // Load sheets data from database
    this.getSheets();
  }

  async getSheets(){

    this.workoutSheetService.getWorkoutSheetData(this.sheetData._id).subscribe((data: [any])=> {

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

      this.openSheet();

      // Dismiss all loading
      this.loadingService.isPageLoading = false;
      this.loadingService.dismissSmallLoading();

    });
  };

  // Set viewing period of chart/table
  // can be triggered programmatically ( case 1 ) or by ion-select ( case 2 )
  async setPeriod($event){

    if($event == "" || $event.target.value.length < 1){
      // case 1, set showPeriod to the latest
      let lastRecordDate = this.sheetData.WorkoutRecords[0].Date.split("-");
      this.showPeriods = [lastRecordDate[1] + "." + lastRecordDate[0]];
    }
    else{
      // case 2, use selected periods from ion-select
      this.showPeriods = $event.target.value;
    }

    // Filter which records to show and sort them by date
    this.sheetData.WorkoutRecordsForSelectedPeriod = this.sheetData.WorkoutRecords.filter((record) => this.showPeriods.indexOf(record.Date.split("-")[1] + "." + record.Date.split("-")[0]) > -1);

    // Format data for chart
    this.chartService.formatChartData(this.sheetData.WorkoutRecordsForSelectedPeriod, this.sheetData.Structure);

  }

  async openSheet(){

    // Sort data in case it has changed since last sorting
    this.timeAndDateService.sortByDate(this.sheetData.WorkoutRecords, "asc");

    // If the sheet is configured, enable adding records and set period to the latest
    if(this.sheetData.Structure.length > 0){
      this.isButtonDisabled.addRecord = false;
      this.setPeriod("");
    }
    else{
      // Don't allow adding records unless sheet is configured
      this.isButtonDisabled.addRecord = true;
    }
  }

  // Show error alert with footer for contacting the admin
  async showErrorAlert(message){

    this.loadingService.dismissSmallLoading();
    let alert = await this.alertController.create({
      header: message,
      message: "Something went wrong. Contact admin: <a href='mailto:elenakikiova@mail.ru'>elenakikiova@mail.ru</a>",
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });

    await alert.present();
  }


  async addRecord(){

    // Show modal for adding a record
    const modal = await this.modalController.create({
      component: NewWorkoutRecordPage,
      componentProps: {
        sheetId: this.sheetData._id,
        recordId: null,
        fields: this.sheetData.Structure,
        date: null,
        values: null
      }
    });
    await modal.present();
    // Get modal data and process it if it's not null
    let modalData = await modal.onWillDismiss();
    modalData = modalData.data;

    if(modalData != null){

      // Add record to database
      this.workoutSheetService.addRecord(modalData).subscribe((data: any)=>
        {
          console.log(data);

          // n.nModified > 0 means the new record upserted an older with the same date
          if(data.docs.nModified > 0){
            this.loadingService.presentSmallLoading("Saving changes...");
            this.getSheets();
          }
          else{
            // If there are no upserts, just a new record, add it to WorkoutRecords
            this.sheetData.WorkoutRecords.push(data.record);
            // Reopen sheet and make a color splash on the new record
            this.openSheet();
            this.colorSplashRow(this.sheetData.WorkoutRecords[0]);
          }


        },
        error => {
          this.showErrorAlert("Oups")
        }
      );
    };
  }

  async colorSplashRow(row){
    row.color = "primary";
    let that = this;
    setTimeout(function(){
      delete row.color;
    }, 500);
  }

  async editRecord(record, rowIndex){
    let recordToEdit = record;

    const modal = await this.modalController.create({
      component: NewWorkoutRecordPage,
      componentProps: {
        sheetId: this.sheetData._id,
        recordId: recordToEdit._id,
        fields: this.sheetData.Structure,
        date: recordToEdit.Date,
        values: recordToEdit.Values
      }
    });

    await modal.present();
    let modalData = await modal.onWillDismiss();
    modalData = modalData.data;

    if(modalData != null){
      // Set new data for the edited record and color splash the row
      this.sheetData.WorkoutRecordsForSelectedPeriod[rowIndex] = modalData;
      this.colorSplashRow(this.sheetData.WorkoutRecordsForSelectedPeriod[rowIndex]);

      // Sent a request for editing the record
      this.workoutSheetService.editRecord(modalData).subscribe((data: any)=>
        {
          // deletedDocs > 0 means the edited record overrode an older one with the same date
          if(data.deletedDocs > 0){
            this.loadingService.presentSmallLoading("Saving changes...");
            this.getSheets();
          }
        },
        error => {
          this.showErrorAlert("Oups")
        }
      );
    };
  }

  async deleteRecord(record, rowIndex){
    console.log(record);

    // Show alert about deleting the record
    const alert = await this.alertController.create({
      header: 'Delete record',
      message: 'The workout record for <b>' + record.Date + '</b> will be permanently deleted.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Delete',
          handler: () => {

            // Remove from WorkoutRecords
            this.sheetData.WorkoutRecords.splice(rowIndex, 1);
            this.workoutSheetService.deleteRecord(record._id).subscribe((data: [any])=>
              {
                this.openSheet();
              },
              error => {
                this.showErrorAlert("Oups")
              }
            );

          }
        }
      ]
    });

    await alert.present();

  }

}
