import { Component, OnInit, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, ActionSheetController } from '@ionic/angular';

// Services

import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../services/loading.service';
import { ErrorToastAndAlertService } from '../services/errorToastAndAlert.service';
import { TimeAndDateService } from '../services/timeAndDate.service';
import { WorkoutService } from '../services/workout.service';

import { NewWorkoutSheetPage } from './newWorkoutSheet/newWorkoutSheet.page';
import { AnalyseService } from '../services/analyse.service';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.page.html',
  styleUrls: ['./workouts.page.scss']
})

@Injectable()
export class WorkoutsPage implements OnInit {

  public MAX_SHEETS_NUMBER = 3;

  public workoutSheets = [];

  public showPeriods = [];

  public canAddSheet = true;

  public stats = {};

  public userData;

  constructor(
    public loadingService: LoadingService,
    public errorToastAndAlertService: ErrorToastAndAlertService,
    public workoutService: WorkoutService,
    public translate: TranslateService,
    public timeAndDateService: TimeAndDateService,
    public analyseService: AnalyseService,
    public alertController: AlertController,
    public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    private route: ActivatedRoute
  ) { };

  ngOnInit() {
    this.loadingService.showPageLoading();
    
    this.userData = this.route.snapshot.data.userData;

    // Load sheets data from database
    this.getSheets();
  }

  async getSheets(){

    console.log(this.userData);

    this.workoutService.getWorkoutSheetsData(this.userData._id).subscribe( async (data: [any]) => {

      // Get data about all sheets
      this.workoutSheets = data;
      console.log(this.workoutSheets);

      if(this.workoutSheets.length > 0){

        // Disable adding a new sheet if there are MAX_SHEETS_NUMBER already
        if(this.workoutSheets.length == this.MAX_SHEETS_NUMBER) this.canAddSheet = false;

        if(this.workoutSheets.length > 0){
          this.stats = await this.analyseService.analyseWorkoutSheets(data);
        }

      }

      console.log("***WorkoutsPage ", this)

      // Dismiss all loading
      this.loadingService.hidePageLoading();

    },
    error => {
      this.errorToastAndAlertService.showErrorAlert("Oups")
    });
  };

  async showSheetActions(sheet, index){
    console.log(sheet, index);
    const actionSheet = await this.actionSheetController.create({
      header: sheet.Title,
      buttons: [
      {
        text: this.translate.instant("Edit"),
        icon: 'create',
        handler: () => {
          this.editSheet(sheet, index)
        }
      },
      {
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

    const modal = await this.modalController.create({
      component: NewWorkoutSheetPage,
      componentProps: {
        sheetTitles: this.workoutSheets.map((sheet) => sheet.Title)
      }
    });

    await modal.present();
    let modalData = await modal.onWillDismiss();


    if(modalData.data != null){
      console.log(modalData);
      let sheet = modalData.data;
      sheet.UserId = this.userData._id;

      this.workoutService.createSheet(sheet).subscribe( async (data: [any])=>
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
    };

  }

  async editSheet(sheet, index){
    console.log(sheet);

    const modal = await this.modalController.create({
      component: NewWorkoutSheetPage,
      componentProps: {
        sheetData: {
          _id: sheet._id,
          UserId: sheet.UserId,
          Title: sheet.Title,
          Color: sheet.Color
        },
        sheetTitles: this.workoutSheets.map((sheet) => sheet.Title)
      }
    });

    await modal.present();
    let modalData = await modal.onWillDismiss();


    if(modalData.data != null){
      console.log(modalData);
      let sheet = modalData.data;

      this.workoutService.updateSheetData(sheet).subscribe( async (data: [any])=>
        {
          console.log(data)
          this.workoutSheets[index].Title = sheet.Title;
          this.workoutSheets[index].Color = sheet.Color;
        },
        error => {
          this.errorToastAndAlertService.showErrorAlert("Oups")
        }
      );
    };

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
