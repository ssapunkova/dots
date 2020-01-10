import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from "@angular/router";

// Services
import { LoadingService } from '../services/loading.service';
import { ErrorToastAndAlertService } from '../services/errorToastAndAlert.service';
import { DataTableService } from '../services/dataTable.service';
import { TimeAndDateService } from '../services/timeAndDate.service';
import { ChartService } from '../services/chart.service';
import { WorkoutService } from '../services/workout.service';

import { NewWorkoutRecordPage } from './newWorkoutRecord/newWorkoutRecord.page';


@Component({
  selector: 'app-workouts',
  templateUrl: './workoutSheet.page.html',
  styleUrls: ['./workoutSheet.page.scss']
})

@Injectable()
export class WorkoutSheetPage implements OnInit {

  public sheetId = null;

  constructor(
    public loadingService: LoadingService,
    public route: ActivatedRoute,
    public errorToastAndAlertService: ErrorToastAndAlertService,
    public timeAndDateService: TimeAndDateService,
    public alertController: AlertController,
    public modalController: ModalController,
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

      // Get data about all sheets
      this.dataTableService.initializeDataTable(data[0]);
      console.log(this.dataTableService);
      //
      // if(data[0].WorkoutRecords.length > 0) this.noRecords = false;

      // Dismiss all loading
      this.loadingService.isPageLoading = false;
      await this.loadingService.dismissSmallLoading();

    });
  };

  async addRecord(){

    let modalProps = {
      component: NewWorkoutRecordPage,
      componentProps: {
        sheetId: this.sheetId,
        recordId: null,
        fields: this.dataTableService.structure,
        date: null,
        values: null
      }
    };

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
        sheetId: this.sheetId,
        recordId: record._id,
        fields: this.dataTableService.structure,
        date: record.Date,
        values: record.Values
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
