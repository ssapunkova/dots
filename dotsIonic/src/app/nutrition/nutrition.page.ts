import { Component, OnInit, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, ActionSheetController } from '@ionic/angular';

// Services
import { LoadingService } from '../services/loading.service';
import { GeneralService } from '../services/general.service'
import { ErrorToastAndAlertService } from '../services/errorToastAndAlert.service';
import { DataTableService } from '../services/dataTable.service';
import { ChartService } from '../services/chart.service';
import { NutritionService } from '../services/nutrition.service';

import { NewNutritionRecordPage } from './newNutritionRecord/newNutritionRecord.page';
import { EditNutritionParamsPage } from './editNutritionParams/editNutritionParams.page';
import { ParamsService } from '../services/params.service';
import { AnalyseService } from '../services/analyse.service';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.page.html',
  styleUrls: ['./nutrition.page.scss'],
})
export class NutritionPage implements OnInit {

  public data = {
    General: {},
    Records: []
  };

  public userData;
  public userParams;

  constructor(
    public loadingService: LoadingService,
    public generalService: GeneralService,
    public errorToastAndAlertService: ErrorToastAndAlertService,
    public actionSheetController: ActionSheetController,
    public modalController: ModalController,
    public nutritionService: NutritionService,
    public paramsService: ParamsService,
    public dataTableService: DataTableService,
    public chartService: ChartService,
    public analyseService: AnalyseService,
    private route: ActivatedRoute
  ) { };

  ngOnInit() {
    this.loadingService.showPageLoading();
    
    this.userData = this.route.snapshot.data.userData;

    // Load nutrition data from database

    console.log("about to get nutr data");
    this.getNutritionData();
  }

  async getNutritionData(){


    this.nutritionService.getNutritionData(this.userData._id).subscribe(async (data: any) => {


      // If user has chosen nutrition params
      if(data.Params.length != 0){
        // Get each param info by index
        for(var i = 0; i < data.Params.length; i++){
          let paramIndex = data.Params[i];
          data.Params[i] = this.paramsService.allParams[paramIndex];
        }
      }

      // Get user's calculated values for params
      this.paramsService.getUserParams(this.userData._id).subscribe((userParams: any) => {
        this.userParams = userParams;
        console.log("USERPARAM", userParams)

        console.log(this.userParams);

        if(this.userParams != null){

          // Get goals - combine custom and default goals
          for(var i = 0; i < data.Params.length; i++){
            // If no custom goal - this col in db will be null
            if(data.Goals[i] == null){

              let paramIndex = data.Params[i].Index;
              // User hasn't entered a custom goal, so
              // -- can use calculated goals from Params page
              // -- can use default goals

              // Check if there is a calculated value for this param
              let indexInUserCalculatedValues = userParams.Params.indexOf(paramIndex);
              if(indexInUserCalculatedValues > -1){
                console.log("Has calculated value for ", data.Params[i].Title, " and it is ", this.userParams.Values[indexInUserCalculatedValues]);
                data.Goals[i] = this.userParams.Values[indexInUserCalculatedValues];
              }
              else{
                // If not, use default value from paramsService
                // Get default goal by param index
                data.Goals[i] = this.paramsService.allParams[paramIndex].Goal;
              }
            }
          }
        }

        // Dismiss all loading

        this.data = data;
        this.loadingService.hidePageLoading();

        console.log("***NutritionPage ", this);

        this.dataTableService.initializeDataTable(data, data.Records, "nutrition");
      
        this.analyseService.analyseNutrition(this.data);

      });

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

    console.log(modalData);

    if(modalData != null){

      await this.loadingService.showProcessLoading("Saving changes");

      // Update nutrition params
      this.nutritionService.updateNutritionParams(modalData).subscribe( async (data: [any])=>
        {
          await this.getNutritionData();
          await this.loadingService.hideProcessLoading();
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
