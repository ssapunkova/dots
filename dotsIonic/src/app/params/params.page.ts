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


  // public userParams = {
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

  public userParams = {};

  
  constructor(
    public paramsService: ParamsService,
    private modalController: ModalController,
    private loadingService: LoadingService,
    private errorToastAndAlertService: ErrorToastAndAlertService
  ) { }

  ngOnInit() {
    this.loadingService.showPageLoading();

    // Get user data
    this.paramsService.getUserParams().subscribe( async (data: [any])=>
    {
      this.userParams = data;

      if(this.userParams == null) this.userParams = {};

      console.log("User params ", this.userParams)
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
        userParams: this.userParams
      }
    });
    await modal.present();

    // Get modal data and process it if it's not null
    await modal.onWillDismiss().then((modalData: OverlayEventDetail) => {
      
      console.log(modalData);

      if(modalData != null){
        // Merge current and new user params
        this.userParams = {
          ...this.userParams,
          ...modalData.data
        }
      }
    });
  }

}
