import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from "@angular/router";

// Services
import { LoadingService } from '../services/loading.service';
import { ErrorToastAndAlertService } from '../services/errorToastAndAlert.service';
import { DataTableService } from '../services/dataTable.service';
import { TimeAndDateService } from '../services/timeAndDate.service';
import { ChartService } from '../services/chart.service';
import { WorkoutService } from '../services/workout.service';

import { NewWorkoutRecordPage } from './newWorkoutRecord/newWorkoutRecord.page';


@Component({
  selector: 'app-workouts',
  templateUrl: './workoutSheet.page.html',
  styleUrls: ['./workoutSheet.page.scss']
})

@Injectable()
export class WorkoutSheetPage implements OnInit {

  public sheetData = {
    _id: null,                            // sheetId, comes with url
    Title: "",                            // Sheet title
    Structure: [],                        // Array of all columns and their goals
    WorkoutRecords: [],                   // Array of json records, raw from database
    WorkoutMonths: [],                    // Array of the available viewing periods (months)
  };

  public showMode = 'chart';              // Default show mode, can be switched to table
  public showPeriods = [];                // The current viewing periods
  public showingRecords = []              // Array of json records of all records in selected viewing period


  constructor(
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
    this.loadingService.isPageLoading = true;
    // Get sheetId
    this.sheetData._id = this.route.snapshot.paramMap.get("sheetId");
    // Load sheet data from database
    this.getSheetData();
  }

  async getSheetData(){
    this.workoutService.getWorkoutSheetData(this.sheetData._id).subscribe(async (data: any) => {

      // Get data about all sheets
      this.sheetData = data[0];
      this.dataTableService.allRecords = data[0].WorkoutRecords;
      console.log(this.sheetData);

      this.openSheet();

      // Dismiss all loading
      this.loadingService.isPageLoading = false;
      await this.loadingService.dismissSmallLoading();

    });
  };

  async showNoRecordsAlert(){
    let message = 'Tap the + button in the right bottom corner to add a record or use the <a href="/workoutManager/"' + this.sheetData._id + '">Workout manager</a>';
    let alert = await this.alertController.create({
      header: 'No records yet',
      message: message,
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });

    await alert.present();
  }


  async openSheet(){

    await this.loadingService.presentSmallLoading("Loading data...");

    // Set period to the latest if there are any records
    if(this.dataTableService.allRecords.length > 0){

      this.dataTableService.setPeriod("");

      // Sort records by date and get array of the months of the records
      this.timeAndDateService.sortByDate(this.dataTableService.allRecords, "asc");

      this.dataTableService.getShowingMonths();

      // Format data for chart
      this.chartService.formatChartData(this.dataTableService.showingRecords, this.sheetData.Structure);

    }
    else{
      this.showNoRecordsAlert();
    }

    await this.loadingService.dismissSmallLoading();

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
      this.workoutService.addRecord(modalData).subscribe( async (data: any)=>
        {
          console.log(data);

          // n.nModified > 0 means the new record upserted an older with the same date
          if(data.docs.nModified > 0){
            this.getSheetData();
          }
          else{
            // If there are no upserts, just a new record, add it to allRecords
            this.dataTableService.allRecords.push(data.record);
            // Reopen sheet and make a color
            this.openSheet();
          }
        },
        error => {
          this.errorToastAndAlertService.showErrorAlert("Oups")
        }
      );
    };
  }


  async editRecord(record){
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
      // Set new data for the edited record
      this.dataTableService.allRecords[recordToEdit.index] = modalData;

      // Sent a request for editing the record
      this.workoutService.editRecord(modalData).subscribe( async (data: any)=>
        {
          // deletedDocs > 0 means the edited record overrode an older one with the same date
          if(data.deletedDocs > 0){
            this.getSheetData();
          }
          else{
            this.openSheet();
          }
        },
        error => {
          this.errorToastAndAlertService.showErrorAlert("Oups")
        }
      );
    };
  }

  async deleteRecord(record){
    console.log(record);

    // Show alert about deleting the record
    let alert = await this.alertController.create({
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

            // Remove from allRecords
            this.dataTableService.allRecords.splice(record.index, 1);
            this.workoutService.deleteRecord(record._id).subscribe( async (data: [any])=>
              {
                this.openSheet();
              },
              error => {
                this.errorToastAndAlertService.showErrorAlert("Oups")
              }
            );

          }
        }
      ]
    });

    await alert.present();

  }

}
