import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, ModalController } from '@ionic/angular';

// Services
import { LoadingService } from '../services/loading.service';
import { ErrorToastAndAlertService } from '../services/errorToastAndAlert.service';
import { DataTableService } from '../services/dataTable.service';
import { ChartService } from '../services/chart.service';
import { NutritionService } from '../services/nutrition.service';

import { NewNutritionRecordPage } from './newNutritionRecord/newNutritionRecord.page';
import { EditNutritionGoalsPage } from './editNutritionGoals/editNutritionGoals.page';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.page.html',
  styleUrls: ['./nutrition.page.scss'],
})
export class NutritionPage implements OnInit {

  constructor(
    public loadingService: LoadingService,
    public errorToastAndAlertService: ErrorToastAndAlertService,
    public alertController: AlertController,
    public modalController: ModalController,
    public nutritionService: NutritionService,
    public dataTableService: DataTableService,
    public chartService: ChartService
  ) { };

  ngOnInit() {
    this.loadingService.isPageLoading = true;
    // Load nutrition data from database
    this.getNutritionData();
  }

  async getNutritionData(){
    this.nutritionService.getNutritionData().subscribe(async (data: any) => {

      // Initialise DataTable, which will controll chart and table

      console.log(data)

      // If no custom params - take default
      if(data.nutritionData.Params.length == 0){
        data.nutritionData.Params = this.nutritionService.DefaultParamIndexes;
      }
      this.dataTableService.initializeDataTable(data.nutritionData, data.nutritionRecords);
      console.log(this.dataTableService);

      // Dismiss all loading
      this.loadingService.isPageLoading = false;
      await this.loadingService.dismissSmallLoading();

    });
  };

  async editGoals(){

    // Select configureable data about the sheet
    let updateData = {
      Params: this.dataTableService.params,
      CustomGoals: this.dataTableService.goals
    };

    // Show a configuration modal
    const modal = await this.modalController.create({
      component: EditNutritionGoalsPage,
      componentProps: updateData
    });
    await modal.present();

    // Get modal data and process it if it's not null
    let modalData = await modal.onWillDismiss();
    modalData = modalData.data;

    console.log(modalData);

    if(modalData != null){

      await this.loadingService.presentSmallLoading("Saving changes");

      // Update nutrition params
      this.nutritionService.updateNutritionParams(modalData).subscribe( async (data: [any])=>
        {
          this.getNutritionData();
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
      component: NewNutritionRecordPage,
      componentProps: {
        RecordId: null,
        Fields: this.dataTableService.params,
        CustomGoals: this.dataTableService.goals,
        Date: null,
        Values: null
      }
    };

    console.log(modalProps);

    let newRecord = await this.dataTableService.addRecord(modalProps);

    this.nutritionService.addRecord(newRecord).subscribe( async (data: any) =>
      {
        // n.nModified > 0 means the new record upserted an older with the same date
        if(data.docs.nModified > 0){
          this.getNutritionData();
        }
      },
      error => {
        this.errorToastAndAlertService.showErrorAlert("Oups")
      }
    );

  }


  async editRecord(record){

    let modalProps = {
      component: NewNutritionRecordPage,
      componentProps: {
        RecordId: record._id,
        Fields: this.dataTableService.goals,
        Date: record.Date,
        Values: record.Values
      }
    }

    let editedRecord = await this.dataTableService.editRecord(record, modalProps);
    console.log(editedRecord)

    this.nutritionService.editRecord(editedRecord).subscribe( async (data: any)=>
      {
        // deletedDocs > 0 means the edited record overrode an older one with the same date
        if(data.deletedDocs > 0){
          this.getNutritionData();
        }
      },
      error => {
        this.errorToastAndAlertService.showErrorAlert("Oups")
      }
    );
  }

  async deleteRecord(record){

    this.dataTableService.deleteRecord(record, () => {
        this.nutritionService.deleteRecord(record._id).subscribe( async (data: [any]) =>
          {}, error => {
            this.errorToastAndAlertService.showErrorAlert("Oups")
          }
        )
    })

  }



}
