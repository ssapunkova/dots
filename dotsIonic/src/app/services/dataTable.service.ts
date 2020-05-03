import { Injectable, Input, Output, EventEmitter } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';

import { GeneralService } from './general.service';
import { TimeAndDateService } from './timeAndDate.service';
import { ErrorToastAndAlertService } from '../services/errorToastAndAlert.service';
import { ChartService } from '../services/chart.service';

import { WorkoutService } from '../services/workout.service';
import { NutritionService } from '../services/nutrition.service';

import { ComponentsModule } from '../components/components.module';
import { LoadingService } from './loading.service';

// DataTable Service
// Implements sorting the data, displayed in ion-grid

@Injectable()
export class DataTableService{

  public showMode: String;
  public title: String;
  public params: any[];
  public allRecords: any[];
  public showingRecords: any[];
  public showingPeriod: any[];
  public months: any[];
  public goals: any[];
  public resultsAnalysis: any[];

  public tableWidth = 0;

  public service;

  public sortedByDate: String;

  public services = {
    "workout": this.workoutService,
    "nutrition": this.nutritionService
  }


  constructor(
    public loadingService: LoadingService,
    public timeAndDateService: TimeAndDateService,
    public chartService: ChartService,
    public generalService: GeneralService,
    public alertController: AlertController,
    public modalController: ModalController,
    public errorToastAndAlertService: ErrorToastAndAlertService,

    public workoutService: WorkoutService,
    public nutritionService: NutritionService,
    public translate: TranslateService
  ) { }

// initializeDataTable is called by data-table component
// general - json with params, goals and etc.
// records - array with json records
// service - name of the service the page is using ( dataTable.service imports all services and then uses the one needed for adding, editing and deleting records )

  async initializeDataTable(general, records, service){

    this.service = this.services[service];    // Get needed service for current page

    this.allRecords = [];                     // Records for all periods
    this.showingRecords = [];                 // Only records that are during showing period
    this.showingPeriod = [];                  // Array of months that are the chosen showing period
    this.months = [];                         // Array of all record months
    this.sortedByDate = "asc";                // Which way is the date sorted (asc/desc)
    this.showMode = "chart";                  // Default show mode, can be switched to table

    this.tableWidth = 0;                      // Min table width, calculated on table's column number

    this.title = general.Title;               // General information
    this.params = general.Params;
    this.goals = general.Goals;

    // If no records yet
    if(records.length == 0){
      this.allRecords = [];
    }
    else{
      this.allRecords = records;
      this.prepareData();
    }

    // If there are no user-selected goals, use params' default goals
    if(this.goals == null){
      this.goals = [];
      for(var i = 0; i < this.params.length; i++){
        this.goals.push(this.params[i].Goal);
      }
    }

    // Calculate each record's params % of goal
    for(var i = 0; i < this.allRecords.length; i++){
      let record = this.allRecords[i];
      record.PercentageOfGoal = [];
      for(var j = 0; j < record.Values.length; j++){
        record.PercentageOfGoal[j] = this.generalService.calculatePercentage(record.Values[j], this.goals[j]);
      }
    }

    // Calculate table width based on table column number
    for(var i = 0; i < this.params.length; i++){
      this.tableWidth += 160;
    }

    console.log("*** DataTableService", this);

    
    this.loadingService.hidePageLoading();

  }

  async initializeChart(){
    this.chartService.formatChartData(this.showingRecords,
    this.params, this.goals);
  }

  // Sorts data, gets and sets showing period
  async prepareData(){

    this.timeAndDateService.sortByDate(this.allRecords, "asc");

    this.getShowingMonths();

    // If there is no showingPeriod set, params for this.setPeriod function will be
    // null for $event and true for default
    if(this.showingPeriod.length == 0){
      this.setPeriod(null, true);
    }
    else{
      this.setPeriod(this.showingPeriod, false);
    }

  }

  async showNoRecordsAlert(){
    let message = this.translate.instant("AddNewRecordTip");
    let alert = await this.alertController.create({
      header: this.translate.instant("NoRecordsWarning"),
      message: message,
      buttons: [ { text: 'Ok' }]
    });
    await alert.present();
  }


  // Switch from table/chart view mode
  async changeShowMode(){
    if(this.showMode == "chart") this.showMode = "table";
    else this.showMode = "chart";
  }

  // Set viewing period of chart/table
  // can be triggered by ion-select or by code (default == true)
  async setPeriod($event, setByDefault){

    if(setByDefault){
      // set showingPeriod to the latest by default
      this.showingPeriod = this.months[0];
    }

    // Filter which records to show and sort them by date
    this.showingRecords = this.allRecords.filter((record) => this.showingPeriod.indexOf(record.Date.split("-")[1] + "." + record.Date.split("-")[0]) > -1);

    // Format data for chart
    if(this.showingPeriod.length > 0){
      this.initializeChart();
    }
  }

  // Get array of records months
  async getShowingMonths(){
    // Array of months - Used to allow the user to select a period ov viewed chart/table
    let months = [];
    this.allRecords.forEach((record, i) => {
      record.index = i;
      let splitDate = record.Date.split("-")[1] + "." + record.Date.split("-")[0];
      if(months.indexOf(splitDate) < 0){
        months.push(splitDate);
      }
    })
    this.months = months;
  }


  // Add record via modal and send modalData to the corresponding service
  async addRecord(modalProps){
    const modal = await this.modalController.create(modalProps);

    await modal.present();
    let modalData = await modal.onWillDismiss();


    if(modalData.data != null){
      // remove any records with the same date as the new one to avoid duplicates
      this.allRecords = this.allRecords.filter((record) => record.Date != modalData.data.Date);
      // add new record to allRecords
      this.allRecords.push(modalData.data);
      // sort records and set new showingPeriod
      this.prepareData();
    };

    this.service.addRecord(modalData.data).subscribe( async (data: any) =>
      error => {
        this.errorToastAndAlertService.showErrorAlert("Oups")
      }
    )
  }

  // Edit record via modal and send modalData to the corresponding service
  async editRecord(record, modalProps){
    const modal = await this.modalController.create(modalProps);

    await modal.present();
    let modalData = await modal.onWillDismiss();


    if(modalData.data != null){
      // remove any records with the same date as the record before and after editing to avoid duplicates
      this.allRecords = this.allRecords.filter((rec) =>
        rec.Date != modalData.data.Date && rec.Date != record.Date
      );
      // add edited record to allRecords
      this.allRecords.push(modalData.data);
      // sort records and set new showingPeriod
      this.prepareData();
    };

    this.service.editRecord(modalData.data).subscribe( async (data: any)=>
      error => {
        this.errorToastAndAlertService.showErrorAlert("Oups")
      }
    );
  }

  // Delete record and send record._id to the corresponding service
  async deleteRecord(record){

    // Show alert about deleting the record
    let alert = await this.alertController.create({
      header: this.translate.instant("DeleteRecord"),
      message: this.translate.instant("DeletingRecordPt1") + record.Date + this.translate.instant("DeleteRecordPt2"),
      buttons: [
        {
          text: this.translate.instant("Cancel"),
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.translate.instant("Delete"),
          handler: () => {
            // Remove from allRecords
            this.allRecords.splice(record.index, 1);
            this.prepareData();

            this.service.deleteRecord(record._id).subscribe( async (data: [any]) =>
              {}, error => {
                this.errorToastAndAlertService.showErrorAlert("Oups")
              }
            )
          }
        }
      ]
    });

    await alert.present();

  }

  // Sort records by date
  async sortByDate(){

    let that = this;
    let result;

    // Sort records using TimeAndDateService
    // Set new sortedByDate value
    if(that.sortedByDate == "asc"){
      this.timeAndDateService.sortByDate(this.showingRecords, "desc");
      this.sortedByDate = "desc";
    }
    else{
      this.timeAndDateService.sortByDate(this.showingRecords, "asc");
      this.sortedByDate = "asc";
    }

  }

  // Sort records by values asc or desc
  // col - for accessing "sorted" value ( has field been sorted asc or desc )
  // colIndex - access the correct value in Values array of the records

  async sortCol(col, colIndex){

    let that = this;
    let result;

    // If it's sorted asc, sort it desc ( b - a )
    // else, if it's sorted desc or hasn't been sorted yet, sort asc ( a - b )
    this.showingRecords.sort(function(a, b){
      let aValue = a.Values[colIndex];
      let bValue = b.Values[colIndex];

      // If value is time (hh:mm:ss format)
      // Calculate duration in seconds using timeConverter service
      if(col.Type == "Time"){
        aValue = that.timeAndDateService.getSeconds(aValue);
        bValue = that.timeAndDateService.getSeconds(bValue);
      }

      // Sort asc/desc
      if(col.sorted == "asc"){
        result = (bValue - aValue);
      }
      else{
        result = (aValue - bValue);
      }
      return result;
    });

    // Set new values for col.sorted for further sorting
    if(col.sorted == "asc"){
      col.sorted = "desc";
    }
    else{
      col.sorted = "asc";
    }
  }

}
