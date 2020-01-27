import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController, ActionSheetController } from '@ionic/angular';

// Services
import { LoadingService } from '../services/loading.service';
import { GeneralService } from '../services/general.service'
import { ErrorToastAndAlertService } from '../services/errorToastAndAlert.service';
import { DataTableService } from '../services/dataTable.service';
import { ChartService } from '../services/chart.service';
import { NutritionService } from '../services/nutrition.service';
import { ParamsService } from '../services/params.service';

import { NewNutritionRecordPage } from './newNutritionRecord/newNutritionRecord.page';
import { EditNutritionParamsPage } from './editNutritionParams/editNutritionParams.page';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.page.html',
  styleUrls: ['./nutrition.page.scss'],
})
export class NutritionPage implements OnInit {

  public data = {
    general: [],
    records: []
  };

  public nutritionParams;

  constructor(
    public loadingService: LoadingService,
    public generalService: GeneralService,
    public errorToastAndAlertService: ErrorToastAndAlertService,
    public actionSheetController: ActionSheetController,
    public modalController: ModalController,
    public nutritionService: NutritionService,
    public dataTableService: DataTableService,
    public chartService: ChartService,
    public paramsService: ParamsService
  ) { };

  ngOnInit() {
    this.loadingService.isPageLoading = true;
    // Get nutrition params
    this.nutritionParams = this.paramsService.nutrition;
    // Load nutrition data from database
    this.getNutritionData();
  }

  async getNutritionData(){


    this.nutritionService.getNutritionData().subscribe(async (data: any) => {

      // If no custom params - take default
      if(data.general.Params.length == 0){
        data.general.Params = this.nutritionParams.DefaultParams;
      }
      else{
        for(var i = 0; i < data.general.Params.length; i++){
          data.general.Params[i] = this.nutritionParams.DefaultParams[data.general.Params[i]];
        }
      }

      // Get goals - combine custom and default goals

      for(var i = 0; i < data.general.Params.length; i++){
        if(data.general.Goals[i] == null){
          console.log(data.general.Params)
          data.general.Goals[i] = this.nutritionParams[data.general.Params[i].Index].Goal;
        }
      }

      // Dismiss all loading

      this.data = data;
      this.loadingService.isPageLoading = false;
      await this.loadingService.dismissSmallLoading();

      console.log("***NutritionPage ",this);

      this.dataTableService.initializeDataTable(data.general, data.records, "nutrition");

    });
  };

  async editParams(){

    // Select configureable data about the sheet
    let updateData = {
      Params: this.dataTableService.params,
      Goals: this.dataTableService.goals
    };

    // Show a configuration modal
    const modal = await this.modalController.create({
      component: EditNutritionParamsPage,
      componentProps: updateData
    });
    await modal.present();

    // Get modal data and process it if it's not null
    let modalData = await modal.onWillDismiss();
    modalData = modalData.data;

    if(modalData != null){

      await this.loadingService.presentSmallLoading("Saving changes");

      // Update nutrition params
      this.nutritionService.updateNutritionParams(modalData).subscribe( async (data: [any])=>
        {
          await this.getNutritionData();
          await this.loadingService.dismissSmallLoading();
        },
        error => {
          this.errorToastAndAlertService.showErrorAlert("Oups")
        }
      );
    }
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

  async addRecord(){

    let modalProps = {
      component: NewNutritionRecordPage,
      componentProps: {
        RecordId: null,
        Fields: this.dataTableService.params,
        Goals: this.dataTableService.goals,
        Date: null,
        Values: null
      }
    };

    this.dataTableService.addRecord(modalProps);

  }


  async editRecord(record){

    let modalProps = {
      component: NewNutritionRecordPage,
      componentProps: {
        RecordId: record._id,
        Fields: this.dataTableService.params,
        Goals: this.dataTableService.goals,
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
