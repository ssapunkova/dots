import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, ActionSheetController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from "@angular/router";

// Services
import { LoadingService } from '../services/loading.service';
import { GeneralService } from '../services/general.service';
import { ErrorToastAndAlertService } from '../services/errorToastAndAlert.service';
import { DataTableService } from '../services/dataTable.service';
import { WorkoutService } from '../services/workout.service';
import { ChartService } from '../services/chart.service';

import { NewWorkoutRecordPage } from './newWorkoutRecord/newWorkoutRecord.page';
import { SheetConfigurationPage } from './sheetConfiguration/sheetConfiguration.page';

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
    Params: [],
    WorkoutRecords: []
  };

  constructor(
    public loadingService: LoadingService,
    public route: ActivatedRoute,
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
    this.loadingService.isPageLoading = true;
    // Get sheetId
    this.sheetId = this.route.snapshot.paramMap.get("sheetId");
    // Load sheet data from database
    this.getSheetData();
  }

  async getSheetData(){
    this.workoutService.getWorkoutSheetData(this.sheetId).subscribe(async (data: any) => {

      this.data = data[0];

      // Dismiss all loading
      this.loadingService.isPageLoading = false;
      await this.loadingService.dismissSmallLoading();

      console.log("***WorkoutSheetPage ", this)

      this.dataTableService.initializeDataTable(this.data, this.data.WorkoutRecords, "workout");

    });
  };


  // Edit sheet's params (exercises) and set goals for them
  async editParams(){

    // Select configureable data about the sheet
    let updateData = {
      _id: this.sheetId,
      Title: this.dataTableService.title,
      Params: this.dataTableService.params
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
          this.getSheetData();
          await this.loadingService.dismissSmallLoading();
        },
        error => {
          this.errorToastAndAlertService.showErrorAlert("Oups")
        }
      );
    }

  }

  async addRecord(){

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


  async showRecordOptions(record){

    const actionSheet = await this.actionSheetController.create({
      header: 'Record',
      buttons: [
        {
          text: 'Edit',
          icon: 'checkmark',
          handler: () => {
            this.editRecord(record);
          }
        },
        {
          text: 'Delete',
          icon: 'trash',
          handler: () => {
            this.deleteRecord(record);
          }
        },
        {
          text: 'Cancel',
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
