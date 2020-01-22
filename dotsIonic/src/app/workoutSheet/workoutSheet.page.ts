import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from "@angular/router";

// Services
import { LoadingService } from '../services/loading.service';
import { GeneralService } from '../services/general.service';
import { ErrorToastAndAlertService } from '../services/errorToastAndAlert.service';
import { DataTableService } from '../services/dataTable.service';
import { WorkoutService } from '../services/workout.service';
import { ChartService } from '../services/chart.service';

import { NewWorkoutRecordPage } from './newWorkoutRecord/newWorkoutRecord.page';


@Component({
  selector: 'app-workouts',
  templateUrl: './workoutSheet.page.html',
  styleUrls: ['./workoutSheet.page.scss']
})

@Injectable()
export class WorkoutSheetPage implements OnInit {

  public sheetId = null;

  public data = [];

  constructor(
    public loadingService: LoadingService,
    public route: ActivatedRoute,
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

      console.log(data);
      this.data = data;

      // Initialise DataTable, which will controll chart and table
      // this.dataTableService.initializeDataTable(data[0], data[0].WorkoutRecords);
      // console.log(this.dataTableService);

      // Dismiss all loading
      this.loadingService.isPageLoading = false;
      await this.loadingService.dismissSmallLoading();

    });
  };

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

    console.log(modalProps)

    let newRecord = await this.dataTableService.addRecord(modalProps);

    this.workoutService.addRecord(newRecord).subscribe( async (data: any) =>
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

    let editedRecord = await this.dataTableService.editRecord(record, modalProps);
    console.log(editedRecord)

    this.workoutService.editRecord(editedRecord).subscribe( async (data: any)=>
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

  async deleteRecord(record){

    this.dataTableService.deleteRecord(record, () => {
        this.workoutService.deleteRecord(record._id).subscribe( async (data: [any]) =>
          {}, error => {
            this.errorToastAndAlertService.showErrorAlert("Oups")
          }
        )
    })

  }

}
