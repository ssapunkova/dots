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
      let indexInParams = this.params.indexOf(possibleParam);
      console.log(indexInParams)
      if(indexInParams >= 0){
        let customGoal = this.customGoals[indexInParams];
        if(customGoal != null){
          this.goalValues[i] = customGoal;
        }
      }
    }

    // for(var i = 0; i < this.nutritionService.Params.length; i++){
    //   let possibleParam = this.nutritionService.Params[i];
    //   this.goalValues[i] = possibleParam.Goal;
    //   console.log(possibleParam, this.params);
    //   let indexInParams = this.params.indexOf(possibleParam);
    //   console.log(indexInParams)
    //   if(indexInParams >= 0){
    //     let customGoal = this.customGoals[indexInParams];
    //     if(customGoal != null){
    //       this.goalValues[i] = customGoal;
    //     }
    //   }
    // }
  }


  async presentActionSheet() {

    let usedParamIndexes = this.params.map((param) => param.Index);
    let notUsedParams = this.nutritionService.Params.filter((param) => usedParamIndexes.indexOf(param.Index) < 0);
    let possibleGoals = notUsedParams.map((param) => {
      return {
        text: param.Title,
        icon: 'refresh-circle',
        handler: () => {
          this.addParam(param)
        }
      }
    })

    // for(var i = 0; i < this.nutritionService.Params.length; i++){
    //   let currentGoal = this.nutritionService.Params[i].Index;
    //
    //   console.log(currentGoal, this.params, this.params.indexOf(currentGoal));
    //
    //   if(this.params.indexOf(currentGoal) < 0){
    //     possibleGoals.push({
    //       text: this.nutritionService.Params[currentGoal].Title,
    //       icon: 'refresh-circle',
    //       handler: () => {
    //         this.addParam(currentGoal.Index);
    //       }
    //     });
    //   }
    // }

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

  async addParam(param){
    this.params.push(param);
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
      if(checking != this.params[i].Goal){
        this.customGoals[i] = checking;
      }
      else {
        this.customGoals[i] = null;
      }
    }

    let results = {
      params: this.params.map((param) => param.Index),
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
