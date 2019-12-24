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
import { ChartService } from '../chartService/chart.service';

import { WorkoutsService } from './workouts.service';

import { SheetConfigurationPage } from './sheetConfiguration/sheetConfiguration.page';
import { NewWorkoutRecordPage } from './newWorkoutRecord/newWorkoutRecord.page';


@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.page.html',
  styleUrls: ['./workouts.page.scss']
})

@Injectable()
export class WorkoutsPage implements OnInit {

  public chartH = 1000;

  public workoutSheets = [];
  public currentSheetIndex = 0;
  public fieldsToFill;

  public showMode = 'chart';
  public showPeriods = [];

  public makeColsEditable = false;

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
    public workoutsService: WorkoutsService,
    public alertController: AlertController,
    public modalController: ModalController,
    public dataTableService: DataTableService,
    public chartService: ChartService,
    public ngxChartsModule: NgxChartsModule
  ) { };

  ngOnInit() {
    this.getSheets();
  }

  async getSheets(){

    this.workoutsService.getWorkoutSheetsData().subscribe((data: [any])=> {
      this.workoutSheets = data;

      console.log(data);

      // for(var j = 0; j < this.workoutSheets.length; j++){
      //
      //   this.workoutSheets[j].WorkoutRecordsByMonths = [];
      //
      //   let currentSheet = this.workoutSheets[j];
      //
      //   if(currentSheet.WorkoutRecords.length > 0){
      //
      //     let currentMonth = currentSheet.WorkoutRecords[0].Date.split("-")[1];
      //     let currentYear = currentSheet.WorkoutRecords[0].Date.split("-")[0];
      //     let currentMonthIndex = 0;
      //     currentSheet.WorkoutRecordsByMonths[0] = { Records: [] };
      //     for(var i = 0; i < currentSheet.WorkoutRecords.length; i++){
      //       let currentRecordMonth = currentSheet.WorkoutRecords[i].Date.split("-")[1];
      //       let currentRecordYear = currentSheet.WorkoutRecords[i].Date.split("-")[0];
      //       console.log(currentMonth, currentRecordMonth)
      //       if(currentRecordMonth != currentMonth || currentRecordYear != currentYear) {
      //         currentMonth = currentRecordMonth;
      //         if(currentRecordYear != currentYear){
      //           currentYear = currentRecordYear;
      //         }
      //         currentMonthIndex++;
      //         console.log(currentMonthIndex);
      //         currentSheet.WorkoutRecordsByMonths[currentMonthIndex] = { Records: [] };
      //       }
      //       currentSheet.WorkoutRecordsByMonths[currentMonthIndex].Month = currentMonth;
      //       currentSheet.WorkoutRecordsByMonths[currentMonthIndex].Year = currentYear;
      //       currentSheet.WorkoutRecordsByMonths[currentMonthIndex].Records.push(currentSheet.WorkoutRecords[i]);
      //     }
      //   }
      //
      // }

      console.log(this.workoutSheets);


      if(this.workoutSheets.length > 0){

        for(var i = 0; i < this.workoutSheets.length; i++){

          let months = [];

          this.workoutSheets[i].WorkoutRecords.forEach((record) => {
            let splitDate = record.Date.split("-")[1] + "." + record.Date.split("-")[0];
            if(months.indexOf(splitDate) < 0){
              months.push(splitDate);
            }
          })

          this.workoutSheets[i].WorkoutMonths = months;

        }

        this.openSheet(0);
        if(this.workoutSheets.length == 3) this.isButtonDisabled.addSheet = true;
      }


      this.loadingService.isPageLoading = false;

    });
  };

  async setPeriod($event){
    if(typeof $event == "string"){
      this.showPeriods = $event;
    }
    else{
      this.showPeriods = $event.target.value;
    }
    console.log(this.showPeriods)

    this.workoutSheets[this.currentSheetIndex].WorkoutRecordsForSelectedPeriod = this.workoutSheets[this.currentSheetIndex].WorkoutRecords.filter((record) => this.showPeriods.indexOf(record.Date.split("-")[1] + "." + record.Date.split("-")[0]) > -1);

    this.chartService.formatChartData(this.workoutSheets[this.currentSheetIndex].WorkoutRecordsForSelectedPeriod, this.workoutSheets[this.currentSheetIndex].Structure);
  }

  async openSheet(sheetIndex){
    this.currentSheetIndex = sheetIndex;

    if(this.workoutSheets[this.currentSheetIndex].WorkoutRecords.length > 0){
      let lastRecordDate = this.workoutSheets[this.currentSheetIndex].WorkoutRecords[0].Date.split("-");
      this.setPeriod(lastRecordDate[1] + "." + lastRecordDate[0]);

      this.dataTableService.sortByDate(this.workoutSheets[this.currentSheetIndex].WorkoutRecordsForSelectedPeriod);

    }
    else{
      this.setPeriod("");
      this.chartService.chartData = null;
    }

    if(this.workoutSheets[this.currentSheetIndex].Structure.length > 0){
      this.isButtonDisabled.addRecord = false;
    }
    else{
      this.isButtonDisabled.addRecord = true;
    }
  }

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


  async configureSheet(){

      let updateData = {
        _id: this.workoutSheets[this.currentSheetIndex]._id,
        Title: this.workoutSheets[this.currentSheetIndex].Title,
        Structure: this.workoutSheets[this.currentSheetIndex].Structure
      };

      const modal = await this.modalController.create({
        component: SheetConfigurationPage,
        componentProps: updateData
      });

      await modal.present();
      let modalData = await modal.onWillDismiss();
      modalData = modalData.data;
      console.log(modalData);

      if(modalData != null){

        this.loadingService.presentSmallLoading("Saving changes");

        this.workoutsService.updateSheetConfiguration(modalData).subscribe((data: [any])=>
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

            let sheetTitles = this.workoutSheets.map((sheet) => sheet.Title);

            if(data.Title == ""){
              this.toastService.showErrorToast("Please enter a name for your new sheet");
              return false;
            }
            else if(sheetTitles.indexOf(data.Title) != -1) {
              this.toastService.showErrorToast("A sheet with that name already exists");
              return false;
            }
            else{

              this.loadingService.presentSmallLoading("Creating sheet");

              this.workoutsService.createSheet(data).subscribe((data: [any])=>
                {
                  console.log(data)
                  this.workoutSheets.push(data);

                  this.loadingService.dismissSmallLoading();

                  // Check is reached MAX sheets number
                  if(this.workoutSheets.length == 3) this.isButtonDisabled.addSheet = true;
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

  async deleteSheet(){
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

            if(data.Title != this.workoutSheets[this.currentSheetIndex].Title){
              this.toastService.showErrorToast("Confirm the name of the sheet you want to delete");
              return false;
            }
            else{

              let deletedIndex = this.currentSheetIndex;
              this.openSheet(0);

              this.workoutsService.deleteSheet(this.workoutSheets[deletedIndex]._id).subscribe((data: [any])=>
                {
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
    let modalData = await modal.onWillDismiss();
    modalData = modalData.data;

    if(modalData != null){

      this.workoutSheets[this.currentSheetIndex].WorkoutRecords.push(modalData);
      this.workoutsService.addRecord(modalData).subscribe((data: any)=>
        {
          console.log(data);
          if(data.modifiedDocs == 1){
            this.getSheets();
          }
        },
        error => {
          this.showErrorAlert("Oups")
        }
      );
    };
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
      this.workoutSheets[this.currentSheetIndex].WorkoutRecords[rowIndex] = modalData;
      this.workoutSheets[this.currentSheetIndex].WorkoutRecords[rowIndex].color = "primary";

      let that = this;
      setTimeout(function(){
        delete that.workoutSheets[that.currentSheetIndex].WorkoutRecords[rowIndex].color;
      }, 500);
      this.workoutsService.editRecord(modalData).subscribe((data: any)=>
        {
          if(data.deletedDocs == 1){
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

            // Remove from table
            this.workoutSheets[this.currentSheetIndex].WorkoutRecords.splice(rowIndex, 1);
            this.workoutsService.deleteRecord(record._id).subscribe((data: [any])=>
              {
                // Expect { message: "success" }
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
