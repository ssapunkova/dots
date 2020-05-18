import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, ActionSheetController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from "@angular/router";

import { TranslateService } from '@ngx-translate/core';

// Services
import { LoadingService } from '../services/loading.service';
import { GeneralService } from '../services/general.service';
import { ErrorToastAndAlertService } from '../services/errorToastAndAlert.service';
import { DataTableService } from '../services/dataTable.service';
import { WorkoutService } from '../services/workout.service';
import { ChartService } from '../services/chart.service';

import { NewWorkoutRecordPage } from './newWorkoutRecord/newWorkoutRecord.page';
import { EditWorkoutParamsPage } from './editWorkoutParams/editWorkoutParams.page';

@Component({
  selector: 'app-workouts',
  templateUrl: './workoutSheet.page.html',
  styleUrls: ['./workoutSheet.page.scss']
})

@Injectable()
export class WorkoutSheetPage implements OnInit {

  public sheetId = null;

  public data = {
    Title: String,
    Color: Number,
    Params: [],
    WorkoutRecords: []
  };

  constructor(
    public loadingService: LoadingService,
    public route: ActivatedRoute,
    private translate: TranslateService,
    public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    public generalService: GeneralService,
    public errorToastAndAlertService: ErrorToastAndAlertService,
    public alertController: AlertController,
    public workoutService: WorkoutService,
    public dataTableService: DataTableService,
    public chartService: ChartService
  ) { };

  ngOnInit() {
    this.loadingService.showPageLoading();
    // Get sheetId
    this.sheetId = this.route.snapshot.paramMap.get("sheetId");
    // Load sheet data from database
    this.getSheetData();
  }

  async getSheetData(){
    this.workoutService.getWorkoutSheetData(this.sheetId).subscribe(async (data: any) => {

      this.data = data[0];

      // Dismiss all loading

      console.log("***WorkoutSheetPage ", this);

      this.dataTableService.initializeDataTable(this.data, this.data.WorkoutRecords, "workout");

      this.analyseResults();

    });
  };


  async analyseResults(){
    
    let results = {
      "needsNewGoal": [],
      "aboveGoal": [],
      "belowGoal": [],
      "nowhereNearGoal": []
    };

    let goalsData = [];

    let registeredParams = [];

    for(let i = 0; i < 5; i++){
      let currentRec = this.data.WorkoutRecords[i];
      for(let j = 0; j < currentRec.PercentageOfGoal.length; j++){
        let paramData = this.data.Params.filter((p) => p._id == currentRec.Params[j])[0];
                
        let index = registeredParams.indexOf(currentRec.Params[j]);
        if(index < 0){
          // Add param to goalsData array
          console.log(currentRec);
          goalsData.push({
            Data: paramData,
            PercentageSum: currentRec.PercentageOfGoal[j],
            AveragePercentage: 0
          });
          registeredParams.push(currentRec.Params[j]);
        }
        else{
          // Increment result percentage sum 
          goalsData[index].PercentageSum += currentRec.PercentageOfGoal[j];
        }
        
      }
    }

    for(let i = 0; i < goalsData.length; i++){
      let averagePercentage = Math.floor(goalsData[i].PercentageSum / 5);
      goalsData[i].AveragePercentage = averagePercentage;

      if(averagePercentage >= 150){
        results.needsNewGoal.push(goalsData[i]);
      } 

      if(averagePercentage > 100){
        results.aboveGoal.push(goalsData[i]);
      }
      else if(averagePercentage > 75){
        results.belowGoal.push(goalsData[i]);
      }
      else{
        results.nowhereNearGoal.push(goalsData[i]);
      }

    }

    console.log(results);

    this.dataTableService.resultsAnalysis = results;

    if(results.needsNewGoal.length > 0){

      let paramsToEdit = [];

      let message = await this.translate.instant("TooGoodResults") + ":";
      for(let i = 0; i < results.needsNewGoal.length; i++){
        let title = results.needsNewGoal[i].Data.Title;
        message += title;
        paramsToEdit.push(title);
      }
      
      console.log(paramsToEdit)

      let alert = await this.alertController.create({
        header: this.translate.instant("GoalsThatNeedUpdating"),
        message: message,
        buttons: [
          {
            text: this.translate.instant("Cancel"),
            role: 'cancel',
            cssClass: 'secondary'
          },
          {
            text: this.translate.instant("UpdateGoalNow"),
            handler: () => this.editParams(paramsToEdit)
          }
        ]
      })
      
      await alert.present();

    }

    // Days since start

    let firstEntry = this.data.WorkoutRecords[this.data.WorkoutRecords.length - 1].Date;
    let lastEntry = this.data.WorkoutRecords[0].Date;
    let weeks = Math.round((new Date(lastEntry).getTime() - new Date(firstEntry).getTime()) / (1000*60*60*24*7));
    console.log(weeks);
    this.dataTableService.weeksSinceStart = weeks;
    
  }

  // Edit sheet's params (exercises) and set goals for them
  async editParams(params){

    // Select configureable data about the sheet
    let updateData = {
      _id: this.sheetId,
      Params: this.dataTableService.params,
      Highlight: params || []
    }

    // Show a configuration modal
    const modal = await this.modalController.create({
      component: EditWorkoutParamsPage,
      componentProps: updateData
    });
    await modal.present();

    // Get modal data and process it if it's not null
    let modalData = await modal.onWillDismiss();
    modalData = modalData.data;

    if(modalData != null){

      await this.loadingService.showProcessLoading(this.translate.instant("SavingChanges"));

      console.log(this.dataTableService.params);

      console.log(updateData);

      this.workoutService.updateSheetData(modalData).subscribe( async (data: [any]) =>
        {
          this.getSheetData();
          await this.loadingService.hideProcessLoading();
        },
        error => {
          this.errorToastAndAlertService.showErrorAlert("Oups")
        }
      );
    }

  }

  async addRecord(){

    if(this.dataTableService.params.length > 0){

      let modalProps = {
        component: NewWorkoutRecordPage,
        componentProps: {
          SheetId: this.sheetId,
          RecordId: null,
          Fields: this.dataTableService.params,
          Date: null,
          Values: null
        }
      };

      this.dataTableService.addRecord(modalProps);

    }
    else{

      this.errorToastAndAlertService.showErrorAlert(this.translate.instant("SetYourGoalsMessage"))

    }

  }


  async showRecordOptions(record){

    const actionSheet = await this.actionSheetController.create({
      header: this.translate.instant("Record"),
      buttons: [
        {
          text: this.translate.instant("Edit"),
          icon: 'checkmark',
          handler: () => {
            this.editRecord(record);
          }
        },
        {
          text: this.translate.instant("Delete"),
          icon: 'trash',
          handler: () => {
            this.deleteRecord(record);
          }
        },
        {
          text: this.translate.instant("Cancel"),
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async editRecord(record){

    let modalProps = {
      component: NewWorkoutRecordPage,
      componentProps: {
        SheetId: this.sheetId,
        RecordId: record._id,
        Fields: this.dataTableService.params,
        Date: record.Date,
        Values: record.Values
      }
    }

    this.dataTableService.editRecord(record, modalProps);

  }

  async deleteRecord(record){

    this.dataTableService.deleteRecord(record);

  }

}
