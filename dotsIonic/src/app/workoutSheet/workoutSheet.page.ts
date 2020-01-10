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

  public noRecords = true;

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

      if(data[0].WorkoutRecords.length > 0) this.noRecords = false;

      // Dismiss all loading
      this.loadingService.isPageLoading = false;
      await this.loadingService.dismissSmallLoading();

    });
  };

  async addRecord(){

    // Show modal for adding a record
    const modal = await this.modalController.create({
      component: NewWorkoutRecordPage,
      componentProps: {
        sheetId: this.sheetId,
        recordId: null,
        fields: this.dataTableService.structure,
        date: null,
        values: null
      }
    });
    await modal.present();
    // Get modal data and process it if it's not null
    let modalData = await modal.onWillDismiss();
    modalData = modalData.data;

    if(modalData != null){

      // Add record to database
      this.workoutService.addRecord(modalData).subscribe( async (data: any)=>
        {
          // n.nModified > 0 means the new record upserted an older with the same date
          if(data.docs.nModified > 0){
            this.getSheetData();
          }
          else{
            // If there are no upserts, just a new record, add it to allRecords
            this.dataTableService.addRecord(data.record);
          }
        },
        error => {
          this.errorToastAndAlertService.showErrorAlert("Oups")
        }
      );
    };
  }


  async editRecord(record){
    let recordToEdit = record;

    const modal = await this.modalController.create({
      component: NewWorkoutRecordPage,
      componentProps: {
        sheetId: this.sheetId,
        recordId: recordToEdit._id,
        fields: this.dataTableService.structure,
        date: recordToEdit.Date,
        values: recordToEdit.Values
      }
    });

    await modal.present();
    let modalData = await modal.onWillDismiss();
    modalData = modalData.data;

    if(modalData != null){
      // Set new data for the edited record

      // Sent a request for editing the record
      this.workoutService.editRecord(modalData).subscribe( async (data: any)=>
        {
          // deletedDocs > 0 means the edited record overrode an older one with the same date
          if(data.deletedDocs > 0){
            this.getSheetData();
          }
          else{
            this.dataTableService.editRecord(recordToEdit.index, modalData);
          }
        },
        error => {
          this.errorToastAndAlertService.showErrorAlert("Oups")
        }
      );
    };
  }

  async deleteRecord(record){

    this.dataTableService.deleteRecord(record, () =>
      {
        this.workoutService.deleteRecord(record._id).subscribe( async (data: [any])=>
          {}, error => {
            this.errorToastAndAlertService.showErrorAlert("Oups")
          }
        )
      }
    )

    // // Show alert about deleting the record
    // let alert = await this.alertController.create({
    //   header: 'Delete record',
    //   message: 'The record for <b>' + record.Date + '</b> will be permanently deleted.',
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       role: 'cancel',
    //       cssClass: 'secondary'
    //     }, {
    //       text: 'Delete',
    //       handler: () => {
    //
    //         // Remove from allRecords
    //         this.workoutService.deleteRecord(record._id).subscribe( async (data: [any])=>
    //           {
    //             this.dataTableService.deleteRecord(record.index);
    //           },
    //           error => {
    //             this.errorToastAndAlertService.showErrorAlert("Oups")
    //           }
    //         );
    //
    //       }
    //     }
    //   ]
    // });
    //
    // await alert.present();

  }

}
