import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, ModalController, ActionSheetController } from '@ionic/angular';

// Services
import { LoadingService } from '../services/loading.service';
import { ErrorToastAndAlertService } from '../services/errorToastAndAlert.service';
import { DataTableService } from '../services/dataTable.service';
import { TimeAndDateService } from '../services/timeAndDate.service';
import { ChartService } from '../services/chart.service';
import { WorkoutService } from '../services/workout.service';

import { SheetConfigurationPage } from './sheetConfiguration/sheetConfiguration.page';


@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.page.html',
  styleUrls: ['./workouts.page.scss']
})

@Injectable()
export class WorkoutsPage implements OnInit {

  public MAX_SHEETS_NUMBER = 3;

  public workoutSheets = [];
  public currentSheetIndex = 0;

  public showMode = 'chart';
  public showPeriods = [];

  public canAddSheet = true;

  public chartData = [];

  constructor(
    public loadingService: LoadingService,
    public errorToastAndAlertService: ErrorToastAndAlertService,
    public workoutService: WorkoutService,
    public timeAndDateService: TimeAndDateService,
    public alertController: AlertController,
    public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    public dataTableService: DataTableService,
    public chartService: ChartService
  ) { };

  ngOnInit() {
    // Load sheets data from database
    this.getSheets();
  }

  async getSheets(){

    this.workoutService.getWorkoutSheetsData().subscribe( async (data: [any])=> {

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

          this.chartData[i] = [];
          this.chartData[i].push(
            {
              "name": "Exercises",
              "value": this.workoutSheets[i].Params.length
            },
            {
              "name": "Workout records",
              "value": this.workoutSheets[i].WorkoutRecords.length
            }
          );

        }

        // Disable adding a new sheet if there are MAX_SHEETS_NUMBER already
        if(this.workoutSheets.length == this.MAX_SHEETS_NUMBER) this.canAddSheet = false;

      }

      console.log(this.chartData)

      // Dismiss all loading
      this.loadingService.isPageLoading = false;
      await this.loadingService.dismissSmallLoading();

    });
  };

  async showSheetActions(sheet, index){
    console.log(sheet, index);
    const actionSheet = await this.actionSheetController.create({
      header: sheet.Title + ' Actions ',
      buttons: [{
        text: 'Delete',
        icon: 'trash',
        handler: () => {
          this.deleteSheet(sheet, index)
        }
      }, {
        text: 'Edit layout',
        icon: 'grid',
        handler: () => {
          this.configureSheet(sheet, index)
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }


  // Configure sheet's params (exercises) and set goals for them
  async configureSheet(sheet, index){

    // Select configureable data about the sheet
    let updateData = {
      _id: sheet._id,
      Title: sheet.Title,
      Params: sheet.Params
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

      await this.loadingService.presentSmallLoading("Saving changes");

      // Update sheet data and reloat sheets
      this.workoutService.updateSheetConfiguration(modalData).subscribe( async (data: [any])=>
        {
          this.getSheets();
          await this.loadingService.dismissSmallLoading();
        },
        error => {
          this.errorToastAndAlertService.showErrorAlert("Oups")
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
              this.errorToastAndAlertService.showErrorToast("Please enter a name for your new sheet");
              return false;
            }
            else {
              // Get all sheet names in order to check for repeating names
              let sheetTitles = this.workoutSheets.map((sheet) => sheet.Title);
              // Show error if a sheet with tis title already exists
              if(sheetTitles.indexOf(data.Title) != -1) {
                this.errorToastAndAlertService.showErrorToast("A sheet with that name already exists");
                return false;
              }
              else{
                // If sheet title is fine, add sheet to database

                this.workoutService.createSheet(data).subscribe( async (data: [any])=>
                  {
                    console.log(data)
                    this.workoutSheets.push(data);
                    // If reached MAX_SHEETS_NUMBER, disable adding new sheets
                    if(this.workoutSheets.length == this.MAX_SHEETS_NUMBER) this.canAddSheet = false;
                    await this.loadingService.dismissSmallLoading();
                  },
                  error => {
                    this.errorToastAndAlertService.showErrorAlert("Oups")
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

  async deleteSheet(sheet, index){
    console.log(sheet)
    // Show alert, where the user has to confirm the name of the sheet to be deleted
    const alert = await this.alertController.create({
      header: 'Delete sheet',
      message: 'This workout sheet and all its records with it will be permanently deleted.',
      inputs: [
        {
          name: "Title",
          type: "text",
          placeholder: "Confirm sheet name (" + sheet.Title + ")"
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
            if(data.Title != sheet.Title){
              this.errorToastAndAlertService.showErrorToast("Confirm the name of the sheet you want to delete");
              return false;
            }
            else{

              // Send request to delete sheet from database
              this.workoutService.deleteSheet(sheet._id).subscribe((data: [any])=>
                {
                  // Delete sheet from workoutSheets
                  this.workoutSheets.splice(index, 1);

                  // Since sheets are definitely < MAX
                  this.canAddSheet = true;

                },
                error => {
                  this.errorToastAndAlertService.showErrorAlert("Oups")
                }
              );
            }
          }
        }
      ]
    });

    await alert.present();
  }

}
