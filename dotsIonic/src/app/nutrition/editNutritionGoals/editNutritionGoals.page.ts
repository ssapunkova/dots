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

  public goalValues = [];
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
    let data = JSON.parse(JSON.stringify(this.navParams.data));
    this.params = data.Params;
    this.customGoals = data.CustomGoals;
    this.deletedParams = [];
    console.log(data)

    for(var i = 0; i < this.nutritionService.Params.length; i++){
      let possibleParam = this.nutritionService.Params[i];
      this.goalValues[i] = possibleParam.Goal;
      console.log(possibleParam, this.params);
      let indexInParams = this.params.indexOf(possibleParam.Index);
      console.log(indexInParams)
      if(indexInParams >= 0){
        let customGoal = this.customGoals[indexInParams];
        if(customGoal != null){
          this.goalValues[i] = customGoal;
        }
      }
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
    this.params.splice(index, 1);
  }

  async saveChanges() {

    for(var i = 0; i < this.params.length; i++){
      let checking = this.goalValues[this.params[i]];

      // If value is null, then delete param
      if(checking == null || checking == ""){
        this.params.splice(i, 1);
      }

      // If there is a custom goal
      if(checking != this.nutritionService.Params[this.params[i]].Goal){
        this.customGoals[i] = checking;
      }
      else {
        this.customGoals[i] = null;
      }
    }

    let results = {
      params: this.params,
      deletedParams: this.deletedParams,
      customGoals: this.customGoals
    }

    console.log(results);

    await this.modalController.dismiss(results);
  }

  async closeModal(){
    await this.modalController.dismiss();
  }

}
