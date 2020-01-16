import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ModalController, NavParams, AlertController, ActionSheetController } from '@ionic/angular';

import { ErrorToastAndAlertService } from '../../services/errorToastAndAlert.service';
import { NutritionService } from '../../services/nutrition.service';

@Component({
  selector: 'modal-page',
  templateUrl: './editNutritionGoals.page.html'
})

@Injectable()
export class EditNutritionGoalsPage implements OnInit {

  public params;
  public deletedParams;

  public customGoals = [];

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private nutritionService: NutritionService,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private errorToastAndAlert: ErrorToastAndAlertService
  ) { }

  ngOnInit() {
    this.params = JSON.parse(JSON.stringify(this.navParams.data)).Params;
    this.deletedParams = [];
    console.log(this.params)

    for(var i = 0; i < this.nutritionService.Params.length; i++){
      this.customGoals[i] = this.nutritionService.Params[i].Goal;
    }
  }


  async presentActionSheet() {

    let possibleGoals = [];

    for(var i = 0; i < this.nutritionService.Params.length; i++){
      let currentGoalIndex = this.nutritionService.Params[i].Index;

      console.log(currentGoalIndex, this.params, this.params.indexOf(currentGoalIndex));

      if(this.params.indexOf(currentGoalIndex) < 0){
        possibleGoals.push({
          text: this.nutritionService.Params[currentGoalIndex].Title,
          icon: 'refresh-circle',
          handler: () => {
            this.addParam(currentGoalIndex);
          }
        });
      }
    }

    possibleGoals.push({
      text: 'Cancel',
      icon: 'close',
      role: 'cancel'
    })

    const actionSheet = await this.actionSheetController.create({
      header: 'Add goal',
      buttons: possibleGoals
    });
    await actionSheet.present();

  }

  async addParam(paramIndex){
    this.params.push(paramIndex);
  }

  async deleteParam(index){
    this.deletedParams.push(this.params[index]);
    console.log(this.deletedParams);

    this.params.splice(index, 1);

    console.log(this.params, this.deletedParams);
  }

  async saveChanges() {

    for(var i = 0; i < this.params.length; i++){
      let checking = this.customGoals[this.params[i]];
      if(checking == null || checking == ""){
        this.params.splice(i, 1);

        console.log("not needed")
      }
    }

    console.log(this.params, this.deletedParams);

    await this.modalController.dismiss({ params: this.params, deletedParams: this.deletedParams });
  }

  async closeModal(){
    await this.modalController.dismiss();
  }

}
