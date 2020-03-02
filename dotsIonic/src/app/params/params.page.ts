import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

// Services with params
import { ParamsService } from '../services/params.service';

import { CalculatorPage } from './calculator/calculator.page';

@Component({
  selector: 'app-params',
  templateUrl: './params.page.html',
  styleUrls: ['./params.page.scss'],
})
export class ParamsPage implements OnInit {


  public userParams = {
    gender: "F",
    age: null,
    height: null,
    weight: null,
    hips: null,
    wrist: null,
    waist: null,
    kcal: null,
    sugar: null,
    activityFactorKcal: null,
    activityFactorZone: null,
    bodyFatPercentage: null,
    daylyProteinIntake: null,
    blocksPerDay: null
  };

  
  constructor(
    public paramsService: ParamsService,
    public modalController: ModalController
  ) { }

  ngOnInit() {
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
    let modalData = await modal.onWillDismiss();
    modalData = modalData.data;

    console.log(modalData);

    if(modalData != null){
      console.log(modalData);

      this.userParams = modalData;
    }
  }

}
