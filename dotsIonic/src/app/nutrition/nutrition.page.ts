import { Component, OnInit, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, ModalController } from '@ionic/angular';

// Services
import { LoadingService } from '../services/loading.service';
import { GeneralService } from '../services/general.service'
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
    public generalService: GeneralService,
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

      // If no custom params - take default
      if(data.nutritionData.Params.length == 0){
        data.nutritionData.Params = this.nutritionService.DefaultParams;
      }
      else{
        for(var i = 0; i < data.nutritionData.Params.length; i++){
          data.nutritionData.Params[i] = this.nutritionService.Params[data.nutritionData.Params[i]];
        }
      }

      // Get goals - combine custom and default goals

        for(var i = 0; i < data.nutritionData.Params.length; i++){
          if(data.nutritionData.Goals[i] == null){
             data.nutritionData.Goals[i] = this.nutritionService.Params[data.nutritionData.Params[i].Index].Goal;
          }
        }

      // Dismiss all loading

      this.data = data;
      this.loadingService.isPageLoading = false;
      await this.loadingService.dismissSmallLoading();

      console.log(this);

    });
  };

  async editGoals(){

    console.log("clicked")

    // Select configureable data about the sheet
    let updateData = {
      Params: this.dataTableService.params,
      Goals: this.dataTableService.goals
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
          await this.nutritionService.loadData();
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
