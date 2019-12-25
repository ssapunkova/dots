import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AlertController, ModalController, ToastController } from '@ionic/angular';

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

import { SheetConfigurationPage } from './sheetConfiguration/sheetConfiguration.page';
import { NewWorkoutRecordPage } from './newWorkoutRecord/newWorkoutRecord.page';


@Component({
  selector: 'app-workouts',
  templateUrl: './workoutSheet.page.html',
  styleUrls: ['./workoutSheet.page.scss']
})

@Injectable()
export class WorkoutSheetPage implements OnInit {

  public MAX_SHEETS_NUMBER = 3;

  public workoutSheets = [];
  public currentSheetIndex = 0;

  public showMode = 'chart';
  public showPeriods = [];

  public isButtonDisabled = {
    addSheet: false,
    addRecord: true
  }

  public smallLoading;

  constructor(
    public http: HttpClient,
    public connectToServerService: ConnectToServerService,
    public loadingService: LoadingService,
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
    // Load sheets data from database
    this.getSheets();
  }

  async getSheets(){

    this.workoutSheetService.getWorkoutSheetsData().subscribe((data: [any])=> {

      // Get data about all sheets
      this.workoutSheets = data;
      console.log(this.workoutSheets);

      if(this.workoutSheets.length > 0){

        // Sort records and get workout periods in every sheet
        for(var i = 0; i < this.workoutSheets.length; i++){

          let months = [];
          this.timeAndDateService.sortByDate(this.workoutSheets[i].WorkoutRecords, "asc");

          // Get array of the months of the records
          // Used to allow the user to select a period ov viewed chart/table
          this.workoutSheets[i].WorkoutRecords.forEach((record) => {
            let splitDate = record.Date.split("-")[1] + "." + record.Date.split("-")[0];
            if(months.indexOf(splitDate) < 0){
              months.push(splitDate);
            }
          })
          this.workoutSheets[i].WorkoutMonths = months;

        }

        // Disable adding a new sheet if there are MAX_SHEETS_NUMBER already
        if(this.workoutSheets.length == this.MAX_SHEETS_NUMBER) this.isButtonDisabled.addSheet = true;

        // Open the first sheet
        this.openSheet(0);
      }

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
      let lastRecordDate = this.workoutSheets[this.currentSheetIndex].WorkoutRecords[0].Date.split("-");
      this.showPeriods = [lastRecordDate[1] + "." + lastRecordDate[0]];
    }
    else{
      // case 2, use selected periods from ion-select
      this.showPeriods = $event.target.value;
    }

    // Filter which records to show and sort them by date
    this.workoutSheets[this.currentSheetIndex].WorkoutRecordsForSelectedPeriod = this.workoutSheets[this.currentSheetIndex].WorkoutRecords.filter((record) => this.showPeriods.indexOf(record.Date.split("-")[1] + "." + record.Date.split("-")[0]) > -1);

    // Format data for chart
    this.chartService.formatChartData(this.workoutSheets[this.currentSheetIndex].WorkoutRecordsForSelectedPeriod, this.workoutSheets[this.currentSheetIndex].Structure);

  }

  async openSheet(sheetIndex){
    // Set current sheet index
    this.currentSheetIndex = sheetIndex;

    // Sort data in case it has changed since last sorting
    this.timeAndDateService.sortByDate(this.workoutSheets[this.currentSheetIndex].WorkoutRecords, "asc");

    // If the sheet is configured, enable adding records and set period to the latest
    if(this.workoutSheets[this.currentSheetIndex].Structure.length > 0){
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

  // Configure sheet's columns (exercises) and set goals for them
  async configureSheet(){

    // Select configureable data about the sheet
    let updateData = {
      _id: this.workoutSheets[this.currentSheetIndex]._id,
      Title: this.workoutSheets[this.currentSheetIndex].Title,
      Structure: this.workoutSheets[this.currentSheetIndex].Structure
    };

    // Show a configuration modal
    const modal = await this.modalController.create({
      component: SheetConfigurationPage,
      componentProps: updateData
    });
    await modal.present();

    // Get modal data and process it if it's not null
    let modalData = await modal.onWillDismiss();
    modalData = modalData.data;

    if(modalData != null){

      this.loadingService.presentSmallLoading("Saving changes");

      // Update sheet data and reloat sheets
      this.workoutSheetService.updateSheetConfiguration(modalData).subscribe((data: [any])=>
        {
          this.getSheets();
          this.loadingService.dismissSmallLoading();
        },
        error => {
          this.showErrorAlert("Oups")
        }
      );
    }

  }


  async addSheet(){

    // Show an alert for the name of the sheet
    const alert = await this.alertController.create({
      header: 'New sheet',
      inputs: [
        {
          name: 'Title',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: (data) => {

            if(data.Title == ""){
              this.toastService.showErrorToast("Please enter a name for your new sheet");
              return false;
            }
            else {
              // Get all sheet names in order to check for repeating names
              let sheetTitles = this.workoutSheets.map((sheet) => sheet.Title);
              // Show error if a sheet with tis title already exists
              if(sheetTitles.indexOf(data.Title) != -1) {
                this.toastService.showErrorToast("A sheet with that name already exists");
                return false;
              }
              else{
                // If sheet title is fine, add sheet to database
                this.loadingService.presentSmallLoading("Creating sheet");
                this.workoutSheetService.createSheet(data).subscribe((data: [any])=>
                  {
                    console.log(data)
                    this.workoutSheets.push(data);
                    this.loadingService.dismissSmallLoading();

                    // If reached MAX_SHEETS_NUMBER, disable adding new sheets
                    if(this.workoutSheets.length == this.MAX_SHEETS_NUMBER) this.isButtonDisabled.addSheet = true;
                  },
                  error => {
                    this.showErrorAlert("Oups")
                  }
                );
              }
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteSheet(){
    // Show alert, where the user has to confirm the name of the sheet to be deleted
    const alert = await this.alertController.create({
      header: 'Delete sheet',
      message: 'This workout sheet and all its records with it will be permanently deleted.',
      inputs: [
        {
          name: "Title",
          type: "text",
          placeholder: "Confirm sheet name (" + this.workoutSheets[this.currentSheetIndex].Title + ")"
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Delete',
          handler: (data) => {
            console.log(data);

            // If the input doesn't match the title
            if(data.Title != this.workoutSheets[this.currentSheetIndex].Title){
              this.toastService.showErrorToast("Confirm the name of the sheet you want to delete");
              return false;
            }
            else{
              // Open first sheet
              this.openSheet(0);
              let deletedIndex = this.currentSheetIndex;

              // Send request to delete sheet from database
              this.workoutSheetService.deleteSheet(this.workoutSheets[deletedIndex]._id).subscribe((data: [any])=>
                {
                  // Delete sheet from workoutSheets
                  this.workoutSheets.splice(deletedIndex, 1);

                  // Since sheets are definitely < MAX
                  this.isButtonDisabled.addSheet = false;

                },
                error => {
                  this.showErrorAlert("Oups")
                }
              );
            }
          }
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
        sheetId: this.workoutSheets[this.currentSheetIndex]._id,
        recordId: null,
        fields: this.workoutSheets[this.currentSheetIndex].Structure,
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
            this.workoutSheets[this.currentSheetIndex].WorkoutRecords.push(data.record);
            // Reopen sheet and make a color splash on the new record
            this.openSheet(this.currentSheetIndex);
            this.colorSplashRow(this.workoutSheets[this.currentSheetIndex].WorkoutRecords[0]);
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
        sheetId: this.workoutSheets[this.currentSheetIndex]._id,
        recordId: recordToEdit._id,
        fields: this.workoutSheets[this.currentSheetIndex].Structure,
        date: recordToEdit.Date,
        values: recordToEdit.Values
      }
    });

    await modal.present();
    let modalData = await modal.onWillDismiss();
    modalData = modalData.data;

    if(modalData != null){
      // Set new data for the edited record and color splash the row
      this.workoutSheets[this.currentSheetIndex].WorkoutRecordsForSelectedPeriod[rowIndex] = modalData;
      this.colorSplashRow(this.workoutSheets[this.currentSheetIndex].WorkoutRecordsForSelectedPeriod[rowIndex]);

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
            this.workoutSheets[this.currentSheetIndex].WorkoutRecords.splice(rowIndex, 1);
            this.workoutSheetService.deleteRecord(record._id).subscribe((data: [any])=>
              {
                this.openSheet(this.currentSheetIndex);
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
