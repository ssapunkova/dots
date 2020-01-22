import { Injectable } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

import { GeneralService } from './general.service';
import { TimeAndDateService } from './timeAndDate.service';
import { ChartService } from '../services/chart.service';

import { WorkoutService } from '../services/workout.service';

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

  public tableWidth = 0;

  public service;

  public sortedByDate: String;

  constructor(
    public timeAndDateService: TimeAndDateService,
    public chartService: ChartService,
    public generalService: GeneralService,
    public alertController: AlertController,
    public modalController: ModalController,

    public workoutService: WorkoutService
  ) { }


  async initializeDataTable(data, records, service){

    console.log(data);

    this.showingRecords = [];
    this.showingPeriod = [];
    this.months = [];
    this.sortedByDate = "asc";
    this.showMode = "table";              // Default show mode, can be switched to table

    this.tableWidth = 0;

    this.title = data.Title;
    this.params = data.Params;
    this.goals = data.Goals;

    if(service == 'workout'){
      console.log("q")
      this.service = this.workoutService;
    }

    console.log("A", this.service, service);

    if(records.length < 1){
      this.allRecords = [];
      this.showNoRecordsAlert();
    }
    else{
      this.allRecords = records;
      this.prepareData();
    }

    if(this.goals == null){
      this.goals = [];
      for(var i = 0; i < this.params.length; i++){
        console.log(this.params[i])
        this.goals.push(this.params[i].Goal);
      }
    }

    for(var i = 0; i < this.allRecords.length; i++){
      let record = this.allRecords[i];
      record.PercentageOfGoal = [];
      for(var j = 0; j < record.Values.length; j++){
        record.PercentageOfGoal[j] = this.generalService.calculatePercentage(record.Values[j], this.goals[j]);
      }
    }

    for(var i = 0; i < this.params.length; i++){
      this.tableWidth += 100;
    }

    console.log(this);

  }

  async prepareData(){
    this.timeAndDateService.sortByDate(this.allRecords, "asc");

    this.chartService.chartData = [];
    this.getShowingMonths();
    this.setPeriod(null, true);
  }

  async showNoRecordsAlert(){
    let message = 'Tap the + button in the right bottom corner to add a record';
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
      this.chartService.formatChartData(this.showingRecords,
       this.params, this.goals);
    }

  }

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

  async addRecord(modalProps){
    const modal = await this.modalController.create(modalProps);

    await modal.present();
    let modalData = await modal.onWillDismiss();
    modalData = modalData.data;

    if(modalData != null){
      // Set new data for the edited record
      this.allRecords.push(modalData);
      this.prepareData();
    };

    this.service.addRecord(modalData).subscribe( async (data: any) =>
      {
        // n.nModified > 0 means the new record upserted an older with the same date
        if(data.docs.nModified > 0){
          this.getSheetData();
        }
      },
      error => {
        this.errorToastAndAlertService.showErrorAlert("Oups")
      }
    );
  }

  async editRecord(record, modalProps){
    const modal = await this.modalController.create(modalProps);

    await modal.present();
    let modalData = await modal.onWillDismiss();
    modalData = modalData.data;

    if(modalData != null){
      // Set new data for the edited record
      this.allRecords[record.index] = modalData;
      this.prepareData();
    };

    this.service.editRecord(modalData).subscribe( async (data: any)=>
      {
        // deletedDocs > 0 means the edited record overrode an older one with the same date
        if(data.deletedDocs > 0){
          this.getSheetData();
        }
      },
      error => {
        this.errorToastAndAlertService.showErrorAlert("Oups")
      }
    );

  }

  async deleteRecord(record, handlerFunc){

    // Show alert about deleting the record
    let alert = await this.alertController.create({
      header: 'Delete record',
      message: 'The record for <b>' + record.Date + '</b> will be permanently deleted.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Delete',
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
