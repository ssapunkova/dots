import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, ModalController, ActionSheetController } from '@ionic/angular';

// Services

import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../services/loading.service';
import { ErrorToastAndAlertService } from '../services/errorToastAndAlert.service';
import { DataTableService } from '../services/dataTable.service';
import { TimeAndDateService } from '../services/timeAndDate.service';
import { ChartService } from '../services/chart.service';
import { WorkoutService } from '../services/workout.service';
import { UserService } from '../services/user.service';

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
    public translate: TranslateService,
    public timeAndDateService: TimeAndDateService,
    public alertController: AlertController,
    public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    public dataTableService: DataTableService,
    public chartService: ChartService,
    public userService: UserService
  ) { };

  ngOnInit() {
    this.loadingService.showPageLoading();
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
              "name": this.translate.instant("Exercises"),
              "value": this.workoutSheets[i].Params.length
            },
            {
              "name": this.translate.instant("WorkoutRecords"),
              "value": this.workoutSheets[i].WorkoutRecords.length
            }
          );

        }

        // Disable adding a new sheet if there are MAX_SHEETS_NUMBER already
        if(this.workoutSheets.length == this.MAX_SHEETS_NUMBER) this.canAddSheet = false;

      }

      console.log("***WorkoutsPage ", this)

      // Dismiss all loading
      this.loadingService.hidePageLoading();

    });
  };

  async showSheetActions(sheet, index){
    console.log(sheet, index);
    const actionSheet = await this.actionSheetController.create({
      header: sheet.Title,
      buttons: [{
        text: this.translate.instant("Delete"),
        icon: 'trash',
        handler: () => {
          this.deleteSheet(sheet, index)
        }
      },
      {
        text: this.translate.instant("Cancel"),
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }


  async addSheet(){

    // Show an alert for the name of the sheet
    const alert = await this.alertController.create({
      header: this.translate.instant("NewSheet"),
      inputs: [
        {
          name: this.translate.instant("Title"),
          type: 'text'
        }
      ],
      buttons: [
        {
          text: this.translate.instant("Cancel"),
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: (data) => {

            if(data.Title == ""){
              this.errorToastAndAlertService.showErrorToast(this.translate.instant("EnterAName"));
              return false;
            }
            else {
              // Get all sheet names in order to check for repeating names
              let sheetTitles = this.workoutSheets.map((sheet) => sheet.Title);
              // Show error if a sheet with tis title already exists
              if(sheetTitles.indexOf(data.Title) != -1) {
                this.errorToastAndAlertService.showErrorToast(this.translate.instant("ExistingSheetName"));
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
    let that = this;
    // Show alert, where the user has to confirm the name of the sheet to be deleted

    const alert = await this.alertController.create({
      header: that.translate.instant("DeleteSheet"),
      message: that.translate.instant("PermanentDeleteWarning"),
      inputs: [
        {
          name: that.translate.instant("Title"),
          type: "text",
          placeholder: that.translate.instant("ConfirmSheetName") + " (" + sheet.Title + ")"
        }
      ],
      buttons: [
        {
          text: that.translate.instant("Cancel"),
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: that.translate.instant("Delete"),
          handler: (data) => {
            console.log(data);

            // If the input doesn't match the title
            if(data.Title != sheet.Title){
              that.errorToastAndAlertService.showErrorToast(this.translate.instant("ConfirmSheetNameError"));
              return false;
            }
            else{

              // Send request to delete sheet from database
              that.workoutService.deleteSheet(sheet._id).subscribe((data: [any])=>
                {
                  // Delete sheet from workoutSheets
                  that.workoutSheets.splice(index, 1);

                  // Since sheets are definitely < MAX
                  that.canAddSheet = true;

                },
                error => {
                  that.errorToastAndAlertService.showErrorAlert("Oups")
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
