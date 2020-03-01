import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

// Services with params
import { ParamsService } from '../services/params.service';

import { CalculatorPage } from './calculator/calculator.page';

@Component({
  selector: 'app-calculate',
  templateUrl: './calculate.page.html',
  styleUrls: ['./calculate.page.scss'],
})
export class CalculatePage implements OnInit {


  public userParams = {
    gender: "F",
    kcal: null,
    sugar: null
  }


  public result = {
    kcal: null,
    fatPercentage: null,
    leanBodyMassInLb: null,
    daylyProteinIntakeInGr: null,
    blocksPerDay: null,
    sugar: null
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
    }
  }

}
