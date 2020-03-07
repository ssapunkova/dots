import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';

// Services
import { ParamsService } from '../services/params.service';
import { LoadingService } from '../services/loading.service';
import { ErrorToastAndAlertService } from '../services/errorToastAndAlert.service';

import { CalculatorPage } from './calculator/calculator.page';

@Component({
  selector: 'app-params',
  templateUrl: './params.page.html',
  styleUrls: ['./params.page.scss'],
})
export class ParamsPage implements OnInit {


  // public userParamValues= {
  //   gender: "F",
  //   age: null,
  //   height: null,
  //   weight: null,
  //   hips: null,
  //   wrist: null,
  //   waist: null,
  //   kcal: null,
  //   sugar: null,
  //   activityFactorKcal: null,
  //   activityFactorZone: null,
  //   bodyFatPercentage: null,
  //   daylyProteinIntake: null,
  //   blocksPerDay: null
  // };

  public userParamTitles = [];
  public userParamValues = {};
  public userParamsData;

  
  constructor(
    public paramsService: ParamsService,
    private modalController: ModalController,
    private loadingService: LoadingService,
    private errorToastAndAlertService: ErrorToastAndAlertService
  ) { }

  ngOnInit() {
    this.loadingService.showPageLoading();

    // Get user data
    this.paramsService.getUserParams().subscribe( async (data)=>
    {
      this.userParamsData = data;

      if(this.userParamsData == null) this.userParamValues= {};
      else{
        for(let i = 0; i < this.userParamsData.Params.length; i++){
          let paramIndex = this.userParamsData.Params[i];
          let paramTitle = this.paramsService.allParams[paramIndex].Title;
          let paramValue = this.userParamsData.Values[i];

          this.userParamTitles.push(paramTitle);
          this.userParamValues[paramTitle] = paramValue;
        }
      }

      console.log("User params data ", this.userParamsData);
      console.log("User params ", this.userParamValues)
    },
    error => {
      this.errorToastAndAlertService.showErrorAlert("Oups")
    }
  );

    this.loadingService.hidePageLoading();
  }

  async openModal(param){
    // Show calculator modal
    const modal = await this.modalController.create({
      component: CalculatorPage,
      componentProps: {
        param: param,
        userParams: this.userParamValues
      }
    });
    await modal.present();

    // Get modal data and process it if it's not null
    await modal.onWillDismiss().then((modalData: OverlayEventDetail) => {
      
      console.log(modalData);

      if(modalData != null){
        // Merge current and new user params
        this.userParamValues= {
          ...this.userParamValues,
          ...modalData.data
        }

        this.userParamTitles = Object.keys(this.userParamValues);

        console.log("User param titles ", this.userParamTitles);

        this.userParamsData = {
          Params: [],
          Values: []
        }

        for(let i = 0; i < this.userParamTitles.length; i++){
          let paramTitle = this.userParamTitles[i];
          let paramIndex = this.paramsService.allParams.filter((param) => param.Title == paramTitle)[0].Index;
          let paramValue = this.userParamValues[paramTitle];

          this.userParamsData.Params.push(paramIndex);
          this.userParamsData.Values.push(paramValue);
        }

        console.log("***")
        console.log(this.userParamsData);

        console.log("Send ", this.userParamsData)
        this.paramsService.updateUserParams(this.userParamsData).subscribe(async (data) => {
          console.log(data);
        })

      }

    });
  }

}
